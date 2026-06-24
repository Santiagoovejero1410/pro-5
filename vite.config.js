import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://restcountries.com/v3.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },

  build: {
    rollupOptions: {
      input: {
        main: '/index.html',
        countries: '/src/pages/countries/index.html',
        detail: '/src/pages/country-detail/index.html',
      },
    },
  },
});