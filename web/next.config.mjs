import path from 'path'
import {fileURLToPath} from 'url'
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
let nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    experimental: {
        esmExternals: true,
    },
    // webpack: function (config) {
    //     // config.plugins.push(
    //     //     new CopyPlugin({
    //     //         patterns: [
    //     //             {from: "node_modules/@pnnh/stele/lib/assets", to: "static/modules/@pnnh/stele/lib/assets"},
    //     //         ],
    //     //     }),
    //     // )
    //     config.experiments = {
    //         asyncWebAssembly: true,
    //         syncWebAssembly: true,
    //         topLevelAwait: true,
    //         layers: true,
    //     };
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
                hostname: 'calieo.xyz'
            }
        ]
    },
    compress: process.env.NODE_ENV === 'production',
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
        silenceDeprecations: ['legacy-js-api'],
    }
}

export default nextConfig
