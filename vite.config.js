import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { localEmailApiPlugin } from './vite-plugin-local-email-api.js'

// https://vite.dev/config/
// Default "/" so `npm run dev` and hosts like Amplify serve from the site root.
// Set VITE_BASE_PATH=/cogcare/ for GitHub Pages project sites (user.github.io/repo/).
const baseRaw = process.env.VITE_BASE_PATH ?? '/'
const base = baseRaw.endsWith('/') ? baseRaw : `${baseRaw}/`

export default defineConfig(({ mode }) => {
  const root = process.cwd()
  const loaded = loadEnv(mode, root, '')
  for (const key of Object.keys(loaded)) {
    if (process.env[key] === undefined) process.env[key] = loaded[key]
  }

  return {
    base,
    plugins: [react(), tailwindcss(), localEmailApiPlugin()],
  }
})
