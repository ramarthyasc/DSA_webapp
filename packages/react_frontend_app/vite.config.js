import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/algogame/1': 'http://localhost:5000',
      '/algogame/2': 'http://localhost:5000',


    },

  }

})
