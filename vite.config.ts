import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/editor/flow",
  server: {
    port: 3001,
    proxy: {
      "/admin": {
        target: "http://localhost:3000/",
        changeOrigin: true,
      },
      "/editor/schema": {
        target: "http://localhost:3002/",
        changeOrigin: true,
      },
      "/errors": {
        target: "http://localhost:3003/",
        changeOrigin: true,
      },
    },
  },
});
