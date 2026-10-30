/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the built app from /Casa_Del_Cocktail/; npm run dev stays at /.
  base: command === 'build' || isPreview ? '/Casa_Del_Cocktail/' : '/',
  plugins: [react()],
  test: {
    // The on-disk module cache would keep an old import.meta.glob result, so new private
    // book files in src/data/private/ would go unchecked by the data tests.
    fsModuleCache: false,
  },
}))
