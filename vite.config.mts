import {defineConfig, loadEnv, UserConfig} from 'vite';
import react from "@vitejs/plugin-react-swc"
import path from "path";

const isProd = process.env.NODE_ENV === 'production'

export default defineConfig((configEnv) => {
    const env = loadEnv(configEnv.mode, __dirname); // 根据 mode 来判断当前是何种环境

    console.log('defineConfig Env', env);
    return {
        mode: env.mode,
        root: process.cwd(),
        base: '/',
        publicDir: 'assets',    // 不存在的目录
        build: {
            sourcemap: true,    // 本就是开源项目，生产环境也生成 sourcemap 方便排查问题
            minify: 'esbuild',
            outDir: `public`,
            emptyOutDir: false, // 不要清空输出目录，因为还有其他资源文件
            rollupOptions: {
                input: {
                    index: path.join(process.cwd(), 'index.html'),
                    worker: path.resolve(__dirname, 'src/services/worker.ts'),
                    setup: path.resolve(__dirname, 'src/services/setup.tsx'),
                },
                output: {
                    entryFileNames: `[name].js`,
                    chunkFileNames: `chunks/[name].js`,
                    assetFileNames: `assets/[name].[ext]`,
                    manualChunks(id) {
                        if (id.includes('node_modules')) {
                            return id.toString().split('node_modules/')[1].split('/')[0].toString();
                        }
                    }
                }
            },
        },
        esbuild: {
            pure: isProd ? ['console.debug'] : [],
            drop: isProd ? ['debugger'] : []
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
            headers: {
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp',
            },
        },
        clearScreen: false,
        optimizeDeps: {
            exclude: ['@sqlite.org/sqlite-wasm'],
        },
    } as UserConfig;
});
