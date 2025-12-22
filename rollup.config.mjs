import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import json from "@rollup/plugin-json";
import alias from '@rollup/plugin-alias';
import path from "path";
import css from "rollup-plugin-import-css";
import preserveDirectives from "rollup-preserve-directives";

export default {
    input: 'src/app/server.tsx',
    output: {
        file: 'dist/server.cjs',
        // dir: 'dist',
        format: 'cjs',
        sourcemap: true,
        exports: 'auto', // 自动处理模块导出
        entryFileNames: '[name].cjs',
        chunkFileNames: '[name].cjs',
        // preserveModules: true,  // 关键：启用模块保留模式
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
        typescript({
            tsconfig: "./tsconfig.json",
            outputToFilesystem: false,
            sourceMap: true,
            exclude: [
                "**/*.test.ts",
                "**/*.test.tsx",
                "**/*.spec.ts",
                "**/*.spec.tsx",
                // "**/client/**",
                "**/node_modules/**",
                "vite.config.mts",
                "vitest.*.ts"
            ]
        }),
        nodeResolve({
            preferBuiltins: true,
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        }),
        commonjs(),
        json(),
        css(),
        preserveDirectives(),
    ],
}
