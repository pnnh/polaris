import {defineConfig} from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        resolveSnapshotPath: (testPath: string, snapExtension: string) => {
            const dir = path.dirname(testPath)
            const base = path.basename(testPath, path.extname(testPath))
            return path.join(dir, 'snapshots', `${base}${snapExtension}`)
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('test'),
    },
})
