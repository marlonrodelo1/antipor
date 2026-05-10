# syntax=docker/dockerfile:1.7

# Antiport web - Dockerfile multi-stage para Dokploy / cualquier runner Docker.
# Monorepo con npm workspaces. Construye Next.js 16 en modo standalone.

# ----- 1. deps -------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /repo

# Copiamos los package.json de la raiz y de cada workspace usado por la web.
# (apps/mobile y packages/db no se usan en el bundle web, pero npm ci los
# necesita listados en el lockfile, asi que los anadimos para que ci no rompa.)
COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/mobile/package.json ./apps/mobile/package.json
COPY packages/ai/package.json ./packages/ai/package.json
COPY packages/db/package.json ./packages/db/package.json

RUN npm ci --no-audit --no-fund --include=dev

# ----- 2. build ------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /repo

COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /repo/packages/ai/node_modules ./packages/ai/node_modules

# Copiamos solo lo necesario para el build de web.
COPY package.json package-lock.json ./
COPY apps/web ./apps/web
COPY packages/ai ./packages/ai
COPY packages/db ./packages/db

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm --workspace apps/web run build

# ----- 3. runtime ----------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# El modo standalone de Next pone la salida en apps/web/.next/standalone
# replicando la estructura del monorepo. Copiamos la raiz tal cual:
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public

USER nextjs
EXPOSE 3000

# El server.js queda anidado dentro de apps/web/ por la estructura del monorepo.
CMD ["node", "apps/web/server.js"]
