import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import json from "@rollup/plugin-json";
import alias from '@rollup/plugin-alias';
import path from "path";

export default {
    input: 'src/app/server.tsx',
    output: {
        file: 'dist/server.cjs',
        format: 'cjs',
        sourcemap: true,
        exports: 'auto' // 自动处理模块导出
    },
    external: [], // 确保不将任何依赖视为外部模块
    plugins: [
        alias({
            entries: [
                {
                    find: '@',
                    replacement: path.resolve(process.cwd(), 'src'),
                },
            ],
        }),
        nodeResolve({
            preferBuiltins: true
        }),
        typescript({
            tsconfig: "./tsconfig.json",
            outputToFilesystem: false,
            sourceMap: true,
            exclude: [
                "**/client/**",
                "**/*.test.ts",
                "**/*.test.tsx",
                "**/*.spec.ts",
                "**/*.spec.tsx",
                "**/node_modules/**",
                "panda.config.ts",
                "vite.config.mts",
                "vitest.*.ts"
            ]
        }),
        commonjs(),
        json(),
    ]
}
