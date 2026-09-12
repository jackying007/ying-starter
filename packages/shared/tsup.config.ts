/// <reference types="node" />
import { defineConfig } from 'tsup'
import { exec } from 'node:child_process'

export default defineConfig(options => ({
  entry: {
    index: './src/index.ts',
    'entity/index': './src/entity/index.ts',
    'dto/index': './src/dto/index.ts',
    'vo/index': './src/vo/index.ts',
    'permission/index': './src/permission/index.ts'
  },
  outDir: 'dist',
  format: 'esm',
  dts: false,
  clean: !options.watch,
  treeshake: true,
  splitting: true,
  onSuccess: async () => {
    exec('tsc --emitDeclarationOnly --declaration', (err, stdout) => {
      if (err) {
        console.error(stdout)
        if (!options.watch) {
          process.exit(1)
        }
      }
    })
  }
}))
