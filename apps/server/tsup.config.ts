import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main.ts'],
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  dts: false,
  clean: true,
  bundle: true
})
