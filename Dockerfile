FROM node:24-alpine AS base

FROM base AS dep
WORKDIR /app
ENV TURBO_DAEMON=false
ENV TURBO_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm --activate
COPY out/json  ./
## 先复制整体 package.json 并执行下载文件作为一层，这样只要依赖不更新下次打包都不会需要重新下载
RUN pnpm config set registry https://registry.npmmirror.com
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
# 再把项目文件复制过去打包
COPY out/full/packages ./packages
COPY out/full/turbo.json ./turbo.json
RUN pnpm build:pkgs

FROM dep AS server-builder
COPY out/full/apps/server ./apps/server
RUN pnpm build:server
RUN pnpm deploy --filter=server --prod --no-optional --legacy prune-server

FROM base AS server
WORKDIR /app
COPY --from=server-builder /app/prune-server/node_modules ./node_modules
COPY --from=server-builder /app/apps/server/dist ./dist
CMD ["node", "dist/main.js"]
