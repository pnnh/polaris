import {ConfigEnv, loadEnv, UserConfig} from 'vite';
import {defineConfig} from 'vite';
import react from "@vitejs/plugin-react-swc"
import path from "path";

export default defineConfig((configEnv) => {
    const env = loadEnv(configEnv.mode, __dirname); // 根据 mode 来判断当前是何种环境

    console.log('defineConfig Env', env);
    return {
        mode: env.mode,
        root: process.cwd(),
        base: '/',
        publicDir: 'assets',    // 不存在的目录
        build: {
            sourcemap: false,
            minify: 'esbuild',
            outDir: `public`,
            emptyOutDir: false, // 不要清空输出目录，因为还有其他资源文件
            rollupOptions: {
                input: {
                    worker: path.resolve(__dirname, 'src/worker.ts'),
                },
                output: {
                    entryFileNames: `[name].js`,
                    // chunkFileNames: `[name].js`,
                    // assetFileNames: `[name].[ext]`,
                    // manualChunks(id) {
                    //     if (id.includes('node_modules')) {
                    //         return id.toString().split('node_modules/')[1].split('/')[0].toString();
                    //     }
                    // }
                }
            },
        },
        esbuild: {
            pure: ['console.debug'],
            drop: ['debugger']
        },
        plugins: [react({tsDecorators: true})],
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
        server: {
            hmr: false,
            allowedHosts: ['huable.local', 'huable.xyz', 'localhost'],
        },
        clearScreen: false
    } as UserConfig;
});
