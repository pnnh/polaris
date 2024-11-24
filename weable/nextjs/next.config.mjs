import path from 'path'
import bundleAnalyzerPlugin from '@next/bundle-analyzer'
import {fileURLToPath} from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
let nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
    experimental: {
        esmExternals: true,
    },
    webpack: function (config, {isServer, dev}) {
        config.experiments = {
            asyncWebAssembly: true,
            syncWebAssembly: true,
            topLevelAwait: true,
            layers: true,
        };
        return config;
    },
    transpilePackages: [],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'localhost'
            },
            {
                protocol: 'https',
                hostname: 'static.calieo.dev'
            },
            {
                protocol: 'https',
                hostname: 'static.calieo.xyz'
            }
        ]
    },
    compress: process.env.ENV === 'production',
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')]
    }
}

// 使用bundleAnalyzer插件
nextConfig = bundleAnalyzerPlugin({
    enabled: process.env.ANALYZE === 'true'
})(nextConfig)

export default nextConfig
