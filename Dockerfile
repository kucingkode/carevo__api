# =========================
# Base
# =========================
FROM node:24-alpine AS base

RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install turbo
RUN npm i -g turbo@^2

# =========================
# Prepare
# =========================
FROM base AS prepare

# Copy files
COPY ./ ./

RUN npx turbo prune --scope=@carevo/api --docker

# =========================
# Builder
# =========================
FROM base AS builder

# Copy configuration files
COPY --from=prepare /app/out/json ./

# Install dependencies
ENV CI=true
RUN npm ci --ignore-scripts

COPY --from=prepare /app/out/full ./

# Build deployment artifacts
RUN turbo build --filter=./packages/* || true 
RUN turbo build --filter=@carevo/api

# =========================
# Runtime
# =========================
FROM gcr.io/distroless/nodejs24-debian13 AS runtime

# Set working directory
WORKDIR /app

# # Copy deployment artifacts
COPY --from=builder /app/ ./

WORKDIR /app/apps/api

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["/nodejs/bin/node", "./entrypoint.mjs"]
CMD ["run"]