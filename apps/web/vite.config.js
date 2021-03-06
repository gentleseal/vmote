import dotenv from 'dotenv'
dotenv.config('./.env.local')

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const { PORT = 3001 } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/(execute|checkin|socket\.io)': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        ws: true
      },
    },
  },
  build: {
    outDir: 'dist/client',
  },
})