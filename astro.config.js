import node from '@astrojs/node'
import { defineConfig, passthroughImageService } from 'astro/config'
import unocss from 'unocss/astro'

export default defineConfig({
  site: 'https://asyomei.org',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  build: { inlineStylesheets: 'never' },
  image: { service: passthroughImageService() },
  vite: {
    ssr: {
      noExternal: import.meta.env.PROD || undefined,
    },
    build: {
      cssMinify: 'lightningcss',
    },
    define: {
      'import.meta.env.BUILD_DATE': JSON.stringify(getBuildDate()),
    },
  },
  devToolbar: { enabled: false },
  integrations: [unocss()],
})

function getBuildDate() {
  const now = new Date().toISOString()
  return now.slice(0, now.indexOf('T'))
}
