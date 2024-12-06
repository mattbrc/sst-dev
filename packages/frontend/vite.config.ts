import { defineConfig, PluginOption } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()] as PluginOption[],
  build: {
    // needed when deploying
    chunkSizeWarningLimit: 800,
  }
})
