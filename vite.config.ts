import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      // FIX: __dirname is not available in ES modules. Use import.meta.url to get the current file's path.
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
    }
  }
});