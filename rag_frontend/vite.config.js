import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      'karissa-unconsigned-simplistically.ngrok-free.dev',
      '.ngrok-free.dev',
      'all'
    ],
    proxy: {
      '/upload': {
        target: 'http://backend:8000',
        changeOrigin: true
      },
      '/query': {
        target: 'http://backend:8000',
        changeOrigin: true
      }
    }
  }
})
