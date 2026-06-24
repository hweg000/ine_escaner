import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        // Widget servido como estático desde el shell mismo
        ine_widget: '/widget/assets/remoteEntry.js', // el build lo pone en assets/
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  // Proxy: /api/* → backend en :4000
  // Así el frontend solo necesita llamar /api/... sin hardcodear el puerto
  server: {
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  preview: {
    allowedHosts: true,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    target: 'esnext',
  },
});
