# Production deployment

The workflows in `.github/workflows/` deploy the `main` branch to the VPS and provide a manual read-only audit. They use GitHub Environment `production`, password-based SSH, and pinned SSH host keys. The audit commands only read server state; deployment runs Docker Compose and updates the app directory.

## GitHub configuration

Create the `production` environment in repository settings. Limit deployments to `main` and add a required reviewer before enabling automatic deployment. Add these environment secrets:

| Secret | Value |
| --- | --- |
| `VPS_HOST` | `212.85.24.238` |
| `VPS_USER` | SSH account with write access to the app directory and Docker Compose access. The supplied account is `root`; a dedicated deploy account is preferable. |
| `VPS_ROOT_PASSWORD_1` | SSH password for `VPS_USER`. Store a rotated password here; the password shared in chat should not be reused. |
| `VPS_KNOWN_HOSTS` | Verified SSH host-key line(s) for the VPS. Reuse the existing value only if it is for this exact server and port; otherwise get the fingerprint from the VPS provider and verify it before saving. GitHub will not reveal an existing secret's value. |
| `POSTGRES_PASSWORD` | Password for the `hadith` PostgreSQL role expected by `docker-compose.yml`. |
| `VISITOR_IP_HASH_SECRET` | A stable random value; generate one with `openssl rand -hex 32` on a trusted device and enter it directly in GitHub. |

Optional environment variables:

| Variable | Default |
| --- | --- |
| `VPS_PORT` | `22` |
| `VPS_APP_DIR` | `/opt/hadith-hotel-2` |

The deployment creates or updates `$VPS_APP_DIR/.env` with the two required app secrets while preserving other keys already there. It transfers the checked-out source to a versioned release directory, builds the Docker image on the VPS, starts the Compose `web` service, and checks the homepage inside the container.

## VPS prerequisites

- SSH access from GitHub Actions on the configured port, with strict host-key verification.
- Docker Engine and the Docker Compose plugin available to `VPS_USER`.
- PostgreSQL reachable from containers at `host.docker.internal:5432`, with database `hadith_hotel` and role `hadith`.
- The app directory writable by `VPS_USER`; `VPS_APP_DIR` must be an absolute path without spaces.
- Any reverse proxy should route to `127.0.0.1:3006`.

The `VPS read-only audit` workflow can be started manually from the Actions tab. It reports system resources, listening ports, Docker and PostgreSQL readiness, Compose file locations, and `.env` variable names only; it never prints `.env` values or application logs.

Both the VPS and PostgreSQL passwords were shared in chat. Rotate them before production use, then save the new values as `VPS_ROOT_PASSWORD_1` and `POSTGRES_PASSWORD`. Confirm that the PostgreSQL value belongs to the `hadith` role expected by the Compose file; that has not been verified against the VPS.

The current environment received `Connection refused` on TCP ports 22, 2222, 2022, and 22022, before SSH authentication. The read-only audit has not run against the VPS. After adding the GitHub secrets, run `VPS read-only audit` from the Actions tab; it will confirm whether the GitHub runner can reach the configured SSH port and authenticate. If the port is not 22, set the `VPS_PORT` environment variable and ensure `VPS_KNOWN_HOSTS` contains the matching host and port.
