# RFx Audit Core

This project is a React application built with Vite. It connects to Supabase for backend services and uses Stripe for payments.

## Project Setup

1. Install [Node.js](https://nodejs.org/) (version 18 or later is recommended).
2. Clone the repository and install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your environment values.

## Environment Variables

The application expects the following variables in a `.env` file:

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```

These variables are loaded via Vite and used by the Supabase client and Stripe integration.

## Local Development

Run a development server with hot reloading:

```bash
npm run dev
```

The app will be available on [http://localhost:5173](http://localhost:5173).

Lint the code (optional):

```bash
npm run lint
```

## Building and Previewing

Create an optimized production build:

```bash
npm run build
```

Preview the built files locally:

```bash
npm run preview
```

The preview server runs on port `4173` by default.

## Docker Usage

The repository includes a `Dockerfile` and `docker-compose.yml` for building and
running the container.

### Dockerfile

```dockerfile
# Stage 1: build the app
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve the built files
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
RUN npm install -g serve
ENV PORT 4173
EXPOSE $PORT
CMD ["sh", "-c", "serve -s dist -l $PORT"]
```

### Building the Image

```bash
docker build -t rfx-audit .
```

### Running with Docker Compose

By default the application listens on port `4173`. The exposed host port can be
changed with the `APP_PORT` environment variable:

```bash
# uses port 4173 by default
docker compose up -d

# override the host port
APP_PORT=8080 docker compose up -d
```

### Manual Docker Run

```bash
docker run -p 4173:4173 rfx-audit
```

### Deploying with Portainer

1. Push your Docker image to a registry (Docker Hub, GitHub Container Registry, etc.).
2. In Portainer, create a new container from the image and map port `4173` to the desired host port.
3. Set your environment variables in the container configuration or mount a `.env` file.
4. Deploy the stack. The application will be reachable at the mapped host port.

## Production Deployment

A typical deployment workflow is:

1. Build the image (`docker build -t rfx-audit .`).
2. Push the image to your registry.
3. Use Portainer or another orchestrator (Docker Compose, Kubernetes) to run the container in production.

## Supabase Edge Function Deployment

This repo contains a sample function under `functions/n8n-proxy` that forwards
requests to an n8n webhook.

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli).
2. Authenticate with `supabase login` and ensure your project is initialized.
3. Deploy the functions:

   ```bash
   supabase functions deploy n8n-proxy
   supabase secrets set N8N_WEBHOOK_URL=<your-n8n-url>
   supabase functions deploy create-portal-link
   supabase secrets set \
     STRIPE_SECRET_KEY=<your-stripe-secret> \
     SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key> \
     SITE_URL=<your-site-url>
   ```

After deployment you can invoke it from the client:

```javascript
const { data, error } = await supabase.functions.invoke('n8n-proxy')
```

To open the Stripe billing portal from the client:

```javascript
const { data, error } = await supabase.functions.invoke('create-portal-link')
```

---

For additional customization (like scanning engines or API key management), see the Settings page inside the application.


## License

This project is licensed under the [MIT License](LICENSE).
