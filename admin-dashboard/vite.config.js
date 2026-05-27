import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main:        resolve(__dirname, 'index.html'),
        login:       resolve(__dirname, 'login.html'),
        register:    resolve(__dirname, 'register.html'),
        discovery:   resolve(__dirname, 'discovery.html'),
        library:     resolve(__dirname, 'library.html'),
        profile:     resolve(__dirname, 'profile.html'),
        admin:       resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
