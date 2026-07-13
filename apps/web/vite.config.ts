import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

// Base path for serving under a sub-path (e.g. VITE_BASE_PATH=/editor/ for
// rieltai.ru/editor). Defaults to '/' so local dev is unaffected.
const base = process.env.VITE_BASE_PATH ?? '/'

const config = defineConfig({
  base,
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  preview: {
    host: true,
    port: 3000,
    // Behind a reverse proxy the Host header is the public domain, not localhost.
    allowedHosts: true,
  },
})

export default config
