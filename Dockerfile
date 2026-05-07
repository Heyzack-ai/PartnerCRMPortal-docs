FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps

COPY package.json package-lock.json ./
COPY apps/partner-docs/package.json apps/partner-docs/package.json

RUN npm ci

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY package.json package-lock.json ./
COPY apps/partner-docs/package.json apps/partner-docs/package.json

RUN npm ci --omit=dev

COPY --from=builder /app/apps/partner-docs ./apps/partner-docs

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=@heyzack/partner-docs"]
