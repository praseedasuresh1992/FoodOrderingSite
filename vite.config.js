import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      /*
       * Every request that starts with /api is forwarded to the backend.
       * This keeps the browser on the same origin (localhost) during dev,
       * so the browser never fires a CORS preflight for API calls.
       *
       * In production your reverse-proxy / hosting layer should do the same
       * OR your backend should emit the correct CORS headers.
       */
      '/api': {
        target: process.env.VITE_API_BASE_URL ?? 'http://localhost:5000',
        changeOrigin: true,   // rewrites the Host header to match the target
        secure: false,        // allow self-signed certs in dev
        // Uncomment the line below if your backend routes don't include /api:
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
