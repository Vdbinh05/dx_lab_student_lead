# syntax=docker/dockerfile:1.7
FROM node:24.15.0-bookworm-slim AS base
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS dependencies
WORKDIR /app
ENV npm_config_jobs=2
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    DATABASE_URL=file:/tmp/dx-lab-build.db
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run db:generate && npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000 \
    LOCAL_DATABASE_URL=file:/data/training.db \
    DATABASE_URL=file:/data/training.db

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/content ./content
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/src/lib/database-maintenance.ts ./src/lib/database-maintenance.ts
COPY --from=builder /app/src/lib/database-client.ts ./src/lib/database-client.ts
COPY --from=builder /app/src/lib/database-config.ts ./src/lib/database-config.ts
COPY --from=builder /app/package.json /app/package-lock.json /app/prisma.config.ts /app/tsconfig.json ./
COPY --from=builder /app/scripts/docker-entrypoint.sh ./scripts/docker-entrypoint.sh
COPY --from=builder /app/scripts/reset-database.ts ./scripts/reset-database.ts

RUN rm -rf /app/.next/cache \
    && mkdir -p /data \
    && chown node:node /data \
    && chmod +x /app/scripts/docker-entrypoint.sh
USER node
EXPOSE 3000
VOLUME ["/data"]
ENTRYPOINT ["/app/scripts/docker-entrypoint.sh"]
