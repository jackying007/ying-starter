FROM oven/bun:alpine AS base

FROM base AS server
WORKDIR /app
COPY apps/server/dist/main.js ./dist/main.js
CMD ["bun", "dist/main.js"]
