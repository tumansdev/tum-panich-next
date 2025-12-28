import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin/',  // Assets will be loaded from /admin/assets/
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
