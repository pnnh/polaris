import {withSentryConfig} from '@sentry/nextjs';
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
    compiler: {
        removeConsole: isProd,
    },
}
const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
    openAnalyzer: false,
})

export default withSentryConfig(withBundleAnalyzer(nextConfig), {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "calieo",

    project: "javascript-nextjs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true
});
