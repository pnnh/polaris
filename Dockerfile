FROM node:22 AS base

FROM base AS deps

ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci --legacy-peer-deps

FROM deps AS builder

ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs --ingroup nodejs

RUN chown -R nextjs:nodejs /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

ENV NODE_ENV=production
ENV PORT=7100
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
