import { defineConfig, presetMini, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetMini({ preflight: 'on-demand' }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    backgroundColor: {
      base: 'var(--bg)',
    },
    colors: {
      accent: 'var(--text-accent)',
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
    },
    fontSize: {
      sm: '10px',
      md: '14px',
      lg: '20px',
    },
  },
})
