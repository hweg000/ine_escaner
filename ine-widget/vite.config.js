import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'ine_widget',
      filename: 'remoteEntry.js',
      exposes: {
        // El shell importará este componente
        './IneVerification': './src/IneVerification.jsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    outDir: '../shell/public/widget', // build directo en el shell
    emptyOutDir: true,
  },
});
