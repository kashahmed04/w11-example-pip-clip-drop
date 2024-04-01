import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  test: {
    environment: 'happy-dom',
    exclude: ['**/e2e/**'],
    root: './',
    reporters: ['default'],
  },
});
