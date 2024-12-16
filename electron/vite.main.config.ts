import type {ConfigEnv, UserConfig} from 'vite';
import {defineConfig, mergeConfig} from 'vite';
import {getBuildConfig, getBuildDefine, external, pluginHotRestart} from './vite.base.config';
import path from "node:path";

export default defineConfig((env) => {
    const forgeEnv = env as ConfigEnv<'build'>;
    const {forgeConfigSelf} = forgeEnv;
    const define = getBuildDefine(forgeEnv);
    const config: UserConfig = {
        build: {
            lib: {
                entry: forgeConfigSelf.entry!,
                fileName: () => '[name].js',
                formats: ['cjs'],
            },
            rollupOptions: {
                external,
            },
        },
        plugins: [pluginHotRestart('restart')],
        define,
        resolve: {
            mainFields: ['module', 'jsnext:main', 'jsnext'],

            alias: [{
                find: "@",
                replacement: path.resolve(__dirname, "./src")
            }, {
                find: "~",
                replacement: path.resolve(__dirname, "./node_modules")
            }]
        },
    };

    return mergeConfig(getBuildConfig(forgeEnv), config);
});
