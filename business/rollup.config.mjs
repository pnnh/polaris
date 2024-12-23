import commonjs from '@rollup/plugin-commonjs'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import strip from '@rollup/plugin-strip'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import terser from '@rollup/plugin-terser'
import pkg from "./package.json" with {type: "json"};
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commonPlugins = [
    commonjs(),
    nodeResolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        moduleDirectories: ['node_modules', 'src'],
        preferBuiltins: true
    }),
    json(),
    typescript({
        tsconfig: 'tsconfig.json',
    }),
    strip({
        include: ['**/*.(js|mjs|ts|tsx)'],
        debugger: true,
        functions: ['console.log', 'console.debug'],
        sourceMap: true
    }),
    terser()
]

const commonExternal = [
    ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
    ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
    ...(pkg.devDependencies ? Object.keys(pkg.devDependencies) : [])
]

let commonConfig = [{
    strictDeprecations: true,
    input: 'src/client.tsx',
    output: {
        file: 'lib/client.cjs',
        format: 'cjs',
        sourcemap: true,
        assetFileNames: '[name][extname]'
    },
    external: commonExternal,
    plugins: commonPlugins
},
    {
        input: 'src/server.tsx',
        output: {
            file: 'lib/server.cjs',
            format: 'cjs',
            sourcemap: true,
            assetFileNames: '[name][extname]'
        },
        external: commonExternal,
        plugins: commonPlugins
    }
]


export default commonConfig
