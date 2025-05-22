import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import sassConfig from './sass.config.js';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        ...sassConfig.sassOptions,
        // Adiciona a implementação do Sass
        implementation: sassConfig.implementation
      }
    }
  }
});