import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist/api',
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs'],
  target: 'node20',
  //   onSuccess: 'node dist/index.js',
});
