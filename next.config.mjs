import path from 'path'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
let nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    experimental: {
        esmExternals: true,
        reactCompiler: true,
    },
    webpack: function (config) {
        return config;

    },
    env: {
        PUBLIC_NODE_ENV: process.env.NODE_ENV,
    },
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
    compress: process.env.NODE_ENV === 'production',
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
        silenceDeprecations: ['legacy-js-api'],
    },
    async rewrites() {
        return [
            {
                source: '/lightning/:path*',
                destination: 'http://localhost:5173/lightning/:path*' // Proxy to Backend
            }
        ]
    }
}

export default nextConfig
