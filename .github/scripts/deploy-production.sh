#!/usr/bin/env bash
set -euo pipefail
trap 'status=$?; echo "::error title=Deployment failed::Remote deployment failed at line $LINENO (exit $status)."; exit "$status"' ERR

app_dir=$1
deploy_sha=$2
repository=https://github.com/DonnyRZ/hadith-hotel-2.git
[[ "$deploy_sha" =~ ^[a-f0-9]{40}$ ]] || exit 1
export GIT_TERMINAL_PROMPT=0
mkdir -p "$app_dir"
exec 9>"$app_dir/deploy.lock"
flock -w 60 9

# A newer push must finish CI before it can replace the current production app.
latest_sha=$(timeout 30 git ls-remote "$repository" refs/heads/main | cut -f1)
if [[ "$latest_sha" != "$deploy_sha" ]]; then
  echo "::notice title=Deployment skipped::A newer main commit exists; waiting for its CI."
  exit 0
fi

cache_dir="$app_dir/source-cache"
release_dir="$app_dir/releases/$deploy_sha"
started=$SECONDS
echo '::notice title=Deployment phase::Fetching the CI-tested source directly from GitHub.'
if [[ ! -d "$cache_dir/.git" ]]; then
  git init -q "$cache_dir"
  git -C "$cache_dir" remote add origin "$repository"
fi
[[ "$(git -C "$cache_dir" remote get-url origin)" == "$repository" ]] || exit 1
git -C "$cache_dir" config remote.origin.promisor true
git -C "$cache_dir" config remote.origin.partialclonefilter blob:none
git -C "$cache_dir" sparse-checkout init --cone
git -C "$cache_dir" sparse-checkout set web
timeout 600 git -C "$cache_dir" fetch --filter=blob:none --depth=1 origin "$deploy_sha"
timeout 600 git -C "$cache_dir" -c advice.detachedHead=false checkout --detach "$deploy_sha"
[[ "$(git -C "$cache_dir" rev-parse HEAD)" == "$deploy_sha" ]] || exit 1
echo "::notice title=Deployment timing::Source fetch and checkout completed in $((SECONDS-started)) seconds; commit=$deploy_sha."

# Copy instead of hardlinking: a later checkout must not modify an older release.
mkdir -p "$release_dir"
cp -a --reflink=auto "$cache_dir/web" "$release_dir/"
cp "$cache_dir/docker-compose.yml" "$release_dir/docker-compose.yml"
compose=(docker compose --project-name hadith-hotel-2 --project-directory "$release_dir" --env-file "$app_dir/.env" -f "$release_dir/docker-compose.yml")
started=$SECONDS
echo '::notice title=Deployment phase::Building the production image with Docker layer caching.'
build_log=$(mktemp)
trap 'rm -f "$build_log"' EXIT
if "${compose[@]}" build web >"$build_log" 2>&1; then
  cat "$build_log"
else
  cat "$build_log"
  while IFS= read -r message; do
    message=${message//%/%25}
    message=${message//$'\r'/%0D}
    echo "::error title=Docker build failed::$message"
  done < <(grep -E 'ERROR:|Error:|error TS[0-9]+|Failed to compile|Killed|ENOMEM|ENOSPC|failed to solve' "$build_log" | tail -5)
  exit 1
fi
echo "::notice title=Deployment timing::Docker build completed in $((SECONDS-started)) seconds."
latest_sha=$(timeout 30 git ls-remote "$repository" refs/heads/main | cut -f1)
if [[ "$latest_sha" != "$deploy_sha" ]]; then
  echo '::notice title=Deployment skipped::Main changed during the build; keeping the current production app.'
  exit 0
fi
"${compose[@]}" up -d web

for attempt in $(seq 1 30); do
  if docker exec hadith-hotel-2-web node -e 'fetch("http://127.0.0.1:3000/", {signal: AbortSignal.timeout(5000)}).then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))' >/dev/null 2>&1; then
    break
  fi
  if [[ "$attempt" == 30 ]]; then
    echo '::error::Production homepage health check failed.'
    exit 1
  fi
  sleep 2
done

docker exec -i hadith-hotel-2-web node <<'NODE'
(async () => {
  for (const prefix of ["", "/id", "/ru", "/uz"]) {
    const path = `${prefix}/suites-rooms`;
    const response = await fetch(`http://127.0.0.1:3000${path}`, {signal: AbortSignal.timeout(10000)});
    const body = await response.text();
    const description = body.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/)?.[1] || "";
    if (!response.ok || !description.includes("114") || /\b112\b/.test(description) || !body.includes(">114</")) {
      throw new Error(`Room count check failed: ${path}, HTTP ${response.status}`);
    }
    console.log(`::notice title=Production verified::${path}: HTTP ${response.status}; displayed count and metadata both show 114 rooms.`);
  }
})().catch(error => { console.error(`::error::${error.message}`); process.exit(1); });
NODE
printf '%s\n' "$deploy_sha" > "$app_dir/deployed-sha"
echo "::notice title=Deployment complete::Production is running the CI-tested commit $deploy_sha."
