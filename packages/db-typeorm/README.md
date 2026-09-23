## 初始化操作

### 1. 数据库设置

在 postgresql 创建好数据库，把连接信息填入 `typeorm.config.ts`

先打包生成产物，否则无法执行后续的脚本

```bash
pnpm build
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

## 数据库迁移同步

以下操作将根据 `typeorm.config.ts` 文件的连接信息进行

### 1. 生成 Migration 文件

自动生成（generate）

当修改了实体类后，可以使用自动生成命令来比较当前实体与数据库实际结构的差异，然后生成相应的迁移文件：

```bash
pnpm typeorm migration:generate ./migrations/[迁移名称] -d ./typeorm.config.ts
```

手动创建（create）

如果需要手动编写 SQL 或逻辑，可以先创建一个空的迁移模板：

```bash
pnpm typeorm migration:create ./migrations/[迁移名称]
```

### 2. 执行 Migration

生成好迁移文件后，就可以把这些变更应用到数据库中。使用以下命令来运行所有尚未执行的迁移：

```bash
pnpm typeorm migration:run -d ./typeorm.config.ts
```

### 3. 回退 Migration

如果需要回滚最近一次的迁移操作，可以使用：

```bash
pnpm typeorm migration:revert -d ./typeorm.config.ts
```
