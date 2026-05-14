import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, writeFileSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-routing',
      closeBundle() {
        // 404.html = fallback untuk Render/GitHub Pages: server returning 404 still loads the SPA
        copyFileSync('dist/index.html', 'dist/404.html')
        // _redirects = Netlify/Render style SPA rewrite so server returns 200 for all routes
        writeFileSync('dist/_redirects', '/* /index.html 200\n')
      },
    },
  ],
})
