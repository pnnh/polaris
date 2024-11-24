import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import eslintJs from '@eslint/js'
import eslintTs from 'typescript-eslint'

const tsFiles = ['{src}/**/*{.ts,.tsx}']

const languageOptions = {
    globals: {
        ...globals.node,
        ...globals.jest,
    },
    ecmaVersion: 2023,
    sourceType: 'module',
}

const customTypescriptConfig = {
    files: tsFiles,
    plugins: {
        import: importPlugin,
        'import/parsers': tsParser,
    },
    languageOptions: {
        ...languageOptions,
        parser: tsParser,
        parserOptions: {
            project: './tsconfig.json',
        },
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
    },
    rules: {
        'import/export': 'error',
        'import/no-duplicates': 'warn',
        ...importPlugin.configs.typescript.rules,
        '@typescript-eslint/no-use-before-define': 'off',
        'require-await': 'off',
        'no-duplicate-imports': 'error',
        'no-unneeded-ternary': 'error',
        'prefer-object-spread': 'error',
        semi: "off",
        "prefer-const": "error",
        'no-unused-vars': 'off',
        'no-trailing-spaces': 'off',
        'object-curly-spacing': 'off',
        'arrow-spacing': 'off',
        'padded-blocks': 'off',
        'space-infix-ops': 'off',
        'no-multiple-empty-lines': 'off',
        'spaced-comment': 'off',
        'comma-dangle': 'off',
        "import/no-named-default": 'off',
        indent: 'off',
        'eol-last': 'off',
        'object-property-newline': 'off',
        'space-before-function-paren': 'off',
        'object-shorthand': 'off',
        quotes: 'off',
        'object-curly-newline': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                ignoreRestSiblings: true,
                args: 'none',
            },
        ],
    },
}

const recommendedTypeScriptConfigs = [
    ...eslintTs.configs.recommended.map((config) => ({
        ...config,
        files: tsFiles,
    })),
    ...eslintTs.configs.stylistic.map((config) => ({
        ...config,
        files: tsFiles,
    })),
]

export default [
    {ignores: ['docs/*', 'build/*', 'lib/*', 'dist/*']}, // global ignores
    eslintJs.configs.recommended,
    ...recommendedTypeScriptConfigs,
    customTypescriptConfig,
]




