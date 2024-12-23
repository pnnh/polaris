import type {ConfigEnv, UserConfig} from 'vite';
import {defineConfig} from 'vite';
import react from "@vitejs/plugin-react"
import path from "node:path";

export default defineConfig((env) => {
    const {mode} = env;

    return {
        mode,
        base: './',
        build: {
            outDir: `dist}`,
        },
        plugins: [react()],
        resolve: {
            preserveSymlinks: true,
            alias: [{
                find: "@",
                replacement: path.resolve(__dirname, "./src")
            }, {
                find: "~",
                replacement: path.resolve(__dirname, "./node_modules")
            }]
        },
        clearScreen: false
    } as UserConfig;
});
