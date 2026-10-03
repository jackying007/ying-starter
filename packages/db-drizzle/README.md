## 初始化操作

### 1. 数据库设置

在 postgresql 创建好数据库，把连接信息填入 `drizzle.config.ts`

执行以下命令初始化数据库

```bash
pnpm drizzle-kit push
```

### 2. 初始化超级管理员

```bash
pnpm tsx scripts/generate-super-admin
```

### 3. 后台权限同步

```bash
pnpm tsx scripts/sync-permission
```

后面每次修改 `packages/shared/src/permission` 模块都需要打包并重新执行脚本同步权限进数据库

### 4. 启动 Drizzle Studio (drizzle自带的数据库可视化管理)

```bash
pnpm drizzle-kit studio
```

## 数据库迁移同步

如果是本地开发模式下，可以直接执行同步命令

```bash
pnpm drizzle-kit push
```

在生产环境下推荐执行以下操作

### 1. 生成迁移文件

当修改了schema后，可以使用自动生成命令来比较当前schema与数据库实际结构的差异，然后生成相应的迁移文件

```bash
pnpm drizzle-kit generate
```

### 2. 执行迁移

生成好迁移文件后，就可以把这些变更应用到数据库中。使用以下命令来运行所有尚未执行的迁移：

```bash
pnpm drizzle-kit migrate
```

整体流程

```
schema.ts
    ↓
drizzle-kit generate
    ↓
migration.sql
    ↓
git commit
    ↓
部署
    ↓
drizzle-kit migrate
```
