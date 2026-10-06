import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import { devtools } from '@tanstack/devtools-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'APP_')
  return {
    envPrefix: 'APP_',
    resolve: { tsconfigPaths: true },
    plugins: [
      tanstackStart(),
      nitro({
        preset: 'bun',
        routeRules: {
          '/api/**': {
            proxy: `${env.APP_SERVER_URL}/api/**`
          }
        },
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
  }
})
