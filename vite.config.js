import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import articlesPlugin from './vite-plugin-articles.js'

export default defineConfig({
  plugins: [react(), articlesPlugin()],
})
