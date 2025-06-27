import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,       // ✅ Lock to the port your backend allows
    strictPort: true  // ✅ Don't fallback to a different port
  }
})
