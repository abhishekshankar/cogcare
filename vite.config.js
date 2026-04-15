import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Default "/" so `npm run dev` and hosts like Amplify serve from the site root.
// Set VITE_BASE_PATH=/cogcare/ for GitHub Pages project sites (user.github.io/repo/).
const baseRaw = process.env.VITE_BASE_PATH ?? '/'
const base = baseRaw.endsWith('/') ? baseRaw : `${baseRaw}/`

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
