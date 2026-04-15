import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Default "/" for hosts that serve the app at the domain root (e.g. AWS Amplify).
// Set VITE_BASE_PATH=/cogcare/ for GitHub Pages project sites (user.github.io/repo/).
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base: base.endsWith('/') ? base : `${base}/`,
  plugins: [react(), tailwindcss()],
})
