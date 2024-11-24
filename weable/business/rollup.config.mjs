import commonjs from '@rollup/plugin-commonjs'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import {visualizer} from 'rollup-plugin-visualizer'
import strip from '@rollup/plugin-strip'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import del from 'rollup-plugin-delete'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import preserveDirectives from 'rollup-preserve-directives'
import pkg from './package.json' with {type: 'json'}
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import replace from '@rollup/plugin-replace'
import alias from "@rollup/plugin-alias";
import sass from 'rollup-plugin-sass';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonPlugins = [
    commonjs(),
    nodeResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectories: ['node_modules', 'src'],
        preferBuiltins: true
    }),
    replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
        __buildDate__: () => JSON.stringify(new Date()),
        __buildVersion: 15,
        '__PACKAGE_NAME__': pkg.name
    }),
    json(),
    typescript({
        tsconfig: 'tsconfig.json',
    }),
    preserveDirectives(),
    strip({
        include: ['**/*.(js|mjs|ts|tsx)'],
        debugger: true,
        functions: ['console.log', 'console.debug'],
        sourceMap: true
    }),
    sass({
        output: 'lib/assets/index.css',
    }),
    terser(),
    visualizer({
        filename: 'build/status.common.html'
    })
]

const commonExternal = [
    ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
    ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
    ...(pkg.devDependencies ? Object.keys(pkg.devDependencies) : [])
]

const dtsPlugins = [
    alias({
        entries: [
            {find: '@', replacement: path.resolve(__dirname, 'src')},
        ]
    }),
    dts()
]


let commonConfig = [{
    strictDeprecations: true,
    input: 'src/index.common.tsx',
    output: {
        file: 'lib/index.common.mjs',
        format: 'esm',
        sourcemap: true,
        assetFileNames: '[name][extname]'
    },
    external: commonExternal,
    plugins: [del({targets: 'lib/*'}), ...commonPlugins]
},
    {
        input: 'src/index.common.tsx',
        output: {
            file: 'lib/index.common.cjs',
            format: 'cjs',
            sourcemap: true,
            assetFileNames: '[name][extname]'
        },
        external: commonExternal,
        plugins: commonPlugins
    },
    {
        input: 'lib/dts/index.common.d.ts',
        output: [{file: 'lib/index.common.d.ts'}],
        external: [/\.(css|scss)$/],
        plugins: dtsPlugins
    }
]

const serverConfig = [{
    input: 'src/index.server.tsx',
    output: {
        file: 'lib/index.server.mjs',
        format: 'esm',
        sourcemap: true,
        assetFileNames: '[name][extname]'
    },
    external: commonExternal,
    plugins: commonPlugins
}, {
    input: 'src/index.server.tsx',
    output: {
        file: 'lib/index.server.cjs',
        format: 'cjs',
        sourcemap: true,
        assetFileNames: '[name][extname]'
    },
    external: commonExternal,
    plugins: commonPlugins
},
    {
        input: 'lib/dts/index.server.d.ts',
        output: [{file: 'lib/index.server.d.ts'}],
        external: [/\.(css|scss)$/],
        plugins: dtsPlugins
    }
]

const clientConfig = [{
    input: 'src/index.client.tsx',
    output: {
        file: 'lib/index.client.mjs',
        format: 'esm',
        sourcemap: true,
        assetFileNames: '[name][extname]'
    },
    external: commonExternal,
    plugins: commonPlugins
}, {
    input: 'src/index.client.tsx',
    output: {
        file: 'lib/index.client.cjs',
        format: 'cjs',
        sourcemap: true,
        assetFileNames: '[name][extname]'
    },
    external: commonExternal,
    plugins: commonPlugins
},
    {
        input: 'lib/dts/index.client.d.ts',
        output: [{file: 'lib/index.client.d.ts'}],
        external: [/\.(css|scss)$/],
        plugins: dtsPlugins
    }
]

const exportConfig = commonConfig.concat(serverConfig).concat(clientConfig)

export default exportConfig
