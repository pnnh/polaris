import type {ConfigEnv, UserConfig} from 'vite';
import {defineConfig} from 'vite';
import {pluginExposeRenderer} from './vite.base.config';
import react from "@vitejs/plugin-react"
import path from "node:path";

export default defineConfig((env) => {
    const forgeEnv = env as ConfigEnv<'renderer'>;
    const {root, mode, forgeConfigSelf} = forgeEnv;
    const name = forgeConfigSelf.name ?? '';

    return {
        root,
        mode,
        base: './',
        build: {
            outDir: `.vite/renderer/${name}`,
        },
        plugins: [react(), pluginExposeRenderer(name)],
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
