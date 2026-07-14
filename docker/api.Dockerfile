# ---------- base ----------
FROM node:20-alpine AS base
RUN corepack enable && apk add --no-cache openssl libc6-compat
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
COPY packages ./packages
RUN pnpm install --frozen-lockfile || pnpm install

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @gv/db generate || true
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["pnpm", "dev"]

# ---------- build ----------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @gv/db generate
RUN pnpm --filter @gv/api build

# ---------- prod ----------
FROM node:20-alpine AS prod
RUN corepack enable && apk add --no-cache openssl libc6-compat
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/packages ./packages
EXPOSE 4000
CMD ["node", "dist/main.js"]
