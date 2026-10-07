import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: 'lib/index.ts',
    format: ['esm', 'cjs'],
    platform: 'neutral',
    target: 'es2022',
    dts: true,
    exports: true,
    publint: true,
    attw: { profile: 'node16' },
  },
  {
    entry: { cli: 'lib/cli/index.ts' },
    format: 'esm',
    platform: 'node',
    target: 'node20',
    dts: false,
  },
])
