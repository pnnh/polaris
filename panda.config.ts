import {defineConfig} from '@pandacss/dev'

export default defineConfig({
    preflight: false,
    syntax: 'template-literal',  // 启用模板字面量语法,
    jsxFramework: 'react',
    layers: {
        reset: 'panda-reset',
        base: 'panda-base',
        tokens: 'panda-tokens',
        recipes: 'panda-recipes',
        utilities: 'panda-utilities',
    },
    include: ['./src/**/*.{ts,tsx,js,jsx}'],
    exclude: [],
    outdir: './src/gen/styled'
})
