import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  assetsInclude: ['**/*.zkey', '**/*.wasm', '**/*.json'],
  define: {
    'process.env': {}
  },
  build: {
    outDir: 'dist'
  }
})

