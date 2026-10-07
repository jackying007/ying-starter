import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import { devtools } from '@tanstack/devtools-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  envPrefix: 'APP_',
  resolve: { tsconfigPaths: true },
  plugins: [
    tanstackStart(),
    nitro({
      preset: 'bun',
      // 不使用 vite 的 server.proxy，这个配置读取 serve/middleware/api-proxy.ts 文件，让本地开发和上线后都能代理
      serverDir: './server',
      output: {
        dir: 'dist'
      }
    }),
    devtools({
      consolePiping: {
        enabled: false
      }
    }),
    react({ compiler: true }),
    tailwindcss(),
    svgr()
  ]
})
