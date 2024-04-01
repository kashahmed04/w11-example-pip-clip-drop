import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './src/index.html',
        dvd: './src/dvd.html',
      },
    },
  },
  root: './src',
  test: {
    environment: 'happy-dom',
    exclude: ['**/e2e/**'],
    root: './',
    reporters: ['default'],
  },
});
