import antfu from '@antfu/eslint-config'

export default antfu({
  astro: true,
  typescript: true,
  unocss: true,
  rules: {
    'antfu/if-newline': 'off',
    'style/brace-style': 'off',
    'node/prefer-global/process': 'off',
  },
})
