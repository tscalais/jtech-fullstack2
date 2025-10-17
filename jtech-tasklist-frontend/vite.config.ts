import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    //port: 3000,
    open: true,
    cors: true,
    proxy: {
      // Proxy para API em desenvolvimento
      '/api': {
        target: 'http://192.168.1.41:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          axios: ['axios'],
        },
      },
    },
  },

  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'axios'],
  },
})
