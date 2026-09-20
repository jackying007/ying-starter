/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly APP_API_BASE: string
  readonly APP_HOMEPAGE: string
  readonly APP_SERVER_URL: string
  readonly APP_CLIENT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
