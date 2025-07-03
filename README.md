# rfx-audit-v3

This repository contains the code for the RedFox Audit Core Vite application.

## Running with Docker

A `Dockerfile` is provided to build the production assets and serve them with
`nginx`. A matching `docker-compose.yml` exposes the container on a configurable
port (default `8080`).

### Local usage

```bash
# build and run using docker compose
docker compose up -d
# change the exposed port
PORT=3000 docker compose up -d
```

### Deploying with Portainer

1. Open Portainer and create a new stack.
2. Paste the contents of `docker-compose.yml` into the stack editor.
3. (Optional) Set the `PORT` environment variable to change the published port.
4. Deploy the stack and access the app via `http://<host>:<PORT>`.

The image is built from source at deploy time. For faster deploys you can
pre-build the image locally and push it to a registry, then update the Compose
file to use that image instead of the build context.
