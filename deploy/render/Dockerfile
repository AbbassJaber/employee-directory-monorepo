# One service for Render: the API serves the built UI from the same origin, and the
# container applies migrations (and resets the demo data) before it starts.
# Build context is the repository root.

FROM node:22-bookworm-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
COPY package.json package-lock.json ./
COPY api/package.json api/
COPY ui/package.json ui/
RUN npm ci
COPY api api
COPY ui ui
RUN cd api && npx prisma generate && npm run build
RUN cd ui && VITE_API_URL=/api npm run build

# The API's dependencies including its dev tools: the Prisma CLI migrates and tsx seeds at start
FROM node:22-bookworm-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /repo
COPY package.json package-lock.json ./
COPY api/package.json api/
RUN npm ci --workspace api && npm cache clean --force
COPY api/prisma api/prisma
COPY api/src/constants api/src/constants
RUN cd api && npx prisma generate
COPY --from=build /repo/api/dist api/dist
COPY --from=build /repo/ui/dist /repo/ui/dist
COPY deploy/render/start.sh /repo/start.sh
RUN chmod +x /repo/start.sh && mkdir -p api/logs && chown node:node api/logs
ENV NODE_ENV=production
ENV WEB_DIST_DIR=/repo/ui/dist
WORKDIR /repo/api
USER node
ENTRYPOINT ["/repo/start.sh"]
