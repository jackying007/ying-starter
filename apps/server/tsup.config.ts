/// <reference types="node" />
import { defineConfig } from 'tsup'
import { exec } from 'node:child_process'

export default defineConfig({
  entry: ['src/main.ts'],
  outDir: 'dist',
  format: 'esm',
  platform: 'node',
  target: 'esnext',
  dts: false,
  clean: true,
  bundle: true,
  onSuccess: async () => {
    exec('tsc -p tsconfig.type.json', (err, stdout) => {
      if (err) {
        console.error(stdout)
        process.exit(1)
      }
    })
  }
})
