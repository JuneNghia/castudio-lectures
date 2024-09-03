import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    define: {
      'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
      'process.env.GH_TOKEN': JSON.stringify(process.env.GH_TOKEN)
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    define: {
      'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
      'process.env.GH_TOKEN': JSON.stringify(process.env.GH_TOKEN)
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    define: {
      'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
      'process.env.GH_TOKEN': JSON.stringify(process.env.GH_TOKEN)
    }
  }
})
