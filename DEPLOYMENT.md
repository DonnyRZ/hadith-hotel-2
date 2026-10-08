# CI, production deployment, and VPS audit

Every branch push and pull request targeting `main` runs CI in `.github/workflows/ci.yml`. CI installs the locked Node.js dependencies, generates Prisma Client, runs ESLint, and builds the Next.js app.

A successful CI run for a push to `main` triggers `.github/workflows/deploy-production.yml`, which builds and deploys that exact tested commit. Manual deployment is also available from the Actions tab on `main`. A failed, cancelled, or timed-out deployment triggers `.github/workflows/vps-audit.yml` for a read-only VPS audit. The audit can also be started manually.

Both VPS workflows use the GitHub Environment `production`, password-based SSH, and pinned SSH host keys. Deployment changes the app on the VPS; audit commands only read server state. Environment protection rules apply to both deployment and automatic audit. If `production` requires reviewer approval, GitHub pauses each affected run until a reviewer approves it.

## GitHub configuration

Create the `production` environment in repository settings and add these environment secrets:

| Secret | Purpose |
| --- | --- |
| `VPS_HOST` | VPS IP address or hostname. |
| `VPS_USER` | SSH account with access to the app directory and Docker Compose. |
| `VPS_ROOT_PASSWORD_1` | SSH password for `VPS_USER`. |
| `VPS_KNOWN_HOSTS` | Pinned SSH host-key lines for the configured host and port. |
| `POSTGRES_PASSWORD` | Password for the PostgreSQL role used by `docker-compose.yml`. |

Optional environment variables:

| Variable | Default |
| --- | --- |
| `VPS_PORT` | `22` |
| `VPS_APP_DIR` | `/opt/hadith-hotel-2` |

The deployment creates or updates `$VPS_APP_DIR/.env` with the PostgreSQL password while preserving other keys. It generates and preserves `VISITOR_IP_HASH_SECRET` on the VPS if it is missing. The VPS fetches the exact CI-tested commit directly from the public GitHub repository into `$VPS_APP_DIR/source-cache`, using a shallow partial clone and sparse checkout of `web` plus root files. The unused root `Asset` directory is excluded. Git reuses unchanged media across deployments; no full source archive is uploaded over SSH. The workflow copies the source into a versioned release directory, reuses Docker build layers, starts the Compose `web` service, checks the homepage, and verifies the displayed count and metadata show 114 rooms in all four languages. Safe timing and verification results appear in Actions annotations. `$VPS_APP_DIR/deployed-sha` records the last successfully verified commit.

An older CI run is skipped if `main` has moved forward. Commits containing `[skip deploy]` run CI without deployment; commits containing `[audit deploy]` also run the read-only audit. Deployments are serialized, and server-side locking prevents overlapping changes.

## VPS prerequisites

- SSH access from GitHub Actions on the configured port, with strict host-key verification.
- Docker Engine and the Docker Compose plugin available to `VPS_USER`.
- Git with sparse checkout/partial clone support, `flock`, and HTTPS access to GitHub from the VPS.
- PostgreSQL reachable from containers at `host.docker.internal:5432`, with database `hadith_hotel` and role `hadith`.
- The app directory writable by `VPS_USER`; `VPS_APP_DIR` must be an absolute path without spaces.
- Any reverse proxy should route to `127.0.0.1:3006`.

The VPS and PostgreSQL passwords were shared in chat. Rotate them and update the GitHub environment secrets before production use. Confirm that the PostgreSQL secret belongs to the `hadith` role expected by `docker-compose.yml`.
