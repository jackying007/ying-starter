## 初始化操作

### 1. 数据库设置

请参考 `packages/db-typeorm` 的 `README.md` 完成初始化。

参考 `.env` 文件，添加一个 `.env.local` (已被git忽略)文件并自行修改环境变量。

### 2. service worker 消息推送设置

```bash
pnpm web-push generate-vapid-keys
```

生成的值请填入 `.env.local` 里的 `VAPID_PUBLIC_KEY` 和 `VAPID_PRIVATE_KEY`

`VAPID_SUBJECT` 可以填入 `mailto:邮箱`
