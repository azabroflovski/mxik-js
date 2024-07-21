import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './src/lib/index.ts',
      name: 'mxik',
      formats: ['es', 'umd', 'iife'],
    },
    minify: 'terser',
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  plugins: [
    dts(),
  ],
})
