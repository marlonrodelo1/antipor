# syntax=docker/dockerfile:1.7

# Antiport web — Dockerfile multi-stage para Dokploy / cualquier runner Docker.
# Construye Next.js 16 en modo standalone (output minimo, sin node_modules de prod).

# ----- 1. deps ---------------------------------------------------------------
FROM node:20-alpine AS deps
WORKDIR /app
COPY apps/web/package.json apps/web/package-lock.json* ./
RUN npm ci --no-audit --no-fund

# ----- 2. build --------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/web/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ----- 3. runtime ------------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# usuario no-root
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# copia el output standalone (incluye node_modules minimos)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
