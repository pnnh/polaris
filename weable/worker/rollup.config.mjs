import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import pkg from './package.json' with {type: 'json'}


const commonExternal = [
    ...(pkg.dependencies ? Object.keys(pkg.dependencies) : []),
    ...(pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []),
    ...(pkg.devDependencies ? Object.keys(pkg.devDependencies) : [])
]

const businessPackageIndex = commonExternal.indexOf('@pnnh/venus-business')
if (businessPackageIndex > -1) {
    commonExternal.splice(businessPackageIndex, 1)
}

export default {
    input: 'main.ts',
    output: {
        file: 'dist/main.mjs',
        format: 'es',
        sourcemap: true
    },
    external: commonExternal,
    plugins: [typescript({
        exclude: ["src"],
        outputToFilesystem: true
    }),
    commonjs(),
    json(),
    nodeResolve({
        preferBuiltins: true
    })]
}
