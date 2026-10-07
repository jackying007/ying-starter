FROM oven/bun:alpine AS base

FROM base AS server
WORKDIR /app
COPY apps/server/dist/main.js ./main.js
RUN mkdir storage
CMD ["bun", "main.js"]

FROM base AS client
WORKDIR /app
COPY apps/client/dist ./
CMD ["bun", "server/index.mjs"]
