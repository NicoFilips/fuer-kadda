import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Projekt-Site liegt unter https://nicofilips.github.io/fuer-kadda/
  base: '/fuer-kadda/',
  plugins: [react()],
})
