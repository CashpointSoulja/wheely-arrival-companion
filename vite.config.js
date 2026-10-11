import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
export default defineConfig({
  base: './',
  build: { modulePreload: { polyfill: false } },
  plugins: [{ name: 'product-notes', closeBundle() { cpSync('docs', 'dist/docs', { recursive: true }); } }]
});
