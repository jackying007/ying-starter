<h1 align="center">Ying Starter</h1>

## 简介

这是一个使用 Pnpm + Turborepo 的 Monorepo 单仓全栈项目，基于 NestJS 实现服务端，Vite + React 实现后台管理系统，Vite + TanStack Start 实现客户端。集成了基本的后台管理系统的角色权限控制逻辑，基于 Tiptap 的内容管理，注册登录和第三方 Oauth 登录逻辑，客户端多语言，Web 离线消息推送。

后台管理端

- Vite
- React
- Tailwind CSS
- Ant Design
- Zustand
- React Hook Form

客户端

- Vite
- TanStack Start
- React
- Tailwind CSS
- Shadcn/ui
- Zustand
- React Hook Form

服务端

- Nestjs
- TypeORM
- MySQL
- Redis
- MinIO

## 开发环境版本

- node v24.15.0
- pnpm v10.33.4

## 开发环境启动

安装依赖并打包所有子包

```bash
pnpm i
pnpm build:pkgs
```

根据[服务端README](./apps/server/README.md)的初始化操作配置好服务端环境

启动应用

```bash
pnpm dev:apps
```

## docker 部署

先使用 turbo 生成干净的依赖项文件用于 docker 缓存。

```bash
rm -rf out
pnpm turbo-prune
```

项目根目录写了 Dockerfile 文件，可使用 docker 的打包命令打包服务端镜像。

```bash
docker build --platform=linux/amd64 --target server -t ying-server:1.0.0 .
```

启动服务端容器参考。

```bash
docker run --name ying-server -d \
  -p 5090:5090 \
  -e SERVER_PORT=5090 \
  -e REDIS_HOST=host.docker.internal \
  -e REDIS_PORT=6379 \
  -e REDIS_PASSWORD=ying123456 \
  -e REDIS_DB=0 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=5432 \
  -e DB_USER=postgres \
  -e DB_PASSWORD=ying123456 \
  -e DB_NAME=ying \
  -e STORAGE_MODE=local \
  ...
  ying-server:1.0.0
```

如果对象存储使用本地模式，并需要保存容器内的文件，可以添加映射到容器内的 `/app/storage`。
