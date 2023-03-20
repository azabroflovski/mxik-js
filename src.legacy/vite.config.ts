import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: './src/lib/index.ts',
            name: 'MXIK',
            formats: ['es', 'cjs', 'umd', 'iife']
        },
    }
})
