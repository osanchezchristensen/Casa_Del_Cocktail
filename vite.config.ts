/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    // The on-disk module cache would keep an old import.meta.glob result, so new private
    // book files in src/data/private/ would go unchecked by the data tests.
    fsModuleCache: false,
  },
})
