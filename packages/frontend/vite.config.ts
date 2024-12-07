import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()] as PluginOption[],
  build: {
    chunkSizeWarningLimit: 800,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  // optional solution to fix buffer (need import in main.tsx)
  // define: {
  //   global: {},
  // },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     define: {
  //       global: 'globalThis',
  //     },
  //   },
  // }
})
