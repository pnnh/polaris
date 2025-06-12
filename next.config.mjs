import path from 'path'
import {fileURLToPath} from 'url'
import bundleAnalyzer from '@next/bundle-analyzer'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
let nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    experimental: {
        esmExternals: true,
        reactCompiler: true,
        serverActions: {
            allowedOrigins: ['huable.local', "*.huable.local"],
        },
    },

    eslint: {
        ignoreDuringBuilds: true,
    },
    allowedDevOrigins: ['huable.local', '*.huable.local'],
    // webpack: (config, {dev}) => {
    //     if (dev) {
    //         config.devtool = false; // Disable source maps
    //     }
    //     return config;
    // },
    images: {
        remotePatterns: [
            {
                hostname: 'localhost'
            },
            {
                hostname: '127.0.0.1'
            },
            {
                hostname: 'huable.xyz'
            }
        ]
    },
    compress: isProd,    // 构建时会压缩
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
        silenceDeprecations: ['legacy-js-api'],
    },
    // async rewrites() {
    //     return isProd ? [] : [
    //         {
    //             source: '/lightning/:path*',
    //             destination: 'http://localhost:5173/lightning/:path*' // Proxy to Backend
    //         }
    //     ]
    // }
}
const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
})

export default withBundleAnalyzer(nextConfig)
