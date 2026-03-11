# =========================
# Base
# =========================
FROM node:24-alpine AS base

RUN apk update
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install --global corepack@latest
RUN corepack enable pnpm

# =========================
# Builder
# =========================
FROM base AS builder

# Copy configuration files
COPY ./package.json ./
COPY ./package-lock.yaml ./

# Install dependencies
ENV CI=true
RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# =========================
# Runtime
# =========================
FROM gcr.io/distroless/nodejs24-debian13 AS runtime

# Set working directory
WORKDIR /app

# # Copy deployment artifacts
COPY --from=builder /app/ ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["/nodejs/bin/node", "./entrypoint.mjs"]
CMD ["run"]