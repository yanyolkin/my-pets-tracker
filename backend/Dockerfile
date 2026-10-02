FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma.config.js ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN DATABASE_URL="postgresql://mock:mock@localhost:5432/mock" npx prisma generate

RUN npm prune --production


FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma.config.js ./prisma.config.js
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

RUN chown -R expressjs:nodejs /app
USER expressjs

EXPOSE 3000

CMD ["node", "src/app.js"]