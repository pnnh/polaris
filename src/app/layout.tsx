import 'server-only'

import './global.scss'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import React from "react";
import {GoogleAnalytics} from "@next/third-parties/google";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import {getLightningUrl, isProd} from "@/services/server/config";
import {JotaiProvider} from "@/components/client/content/provider";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import {Roboto} from 'next/font/google';
import {ThemeProvider} from '@mui/material/styles';
import theme from '@/components/client/theme';

const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-roboto',
});

// 隔几秒重新验证下数据
export const revalidate = 1
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: '希波万象',
    description: '实用工具集',
}

export default async function RootLayout({
                                             children
                                         }: { children: React.ReactNode }) {
    const lightningUrl = getLightningUrl()
    return <html lang='zh'>
    <head>
        <base href="/"/>
        <meta charSet="utf-8"/>
        <meta name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
        <meta name="renderer" content="webkit"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta name="robots" content="index,follow"/>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96"/>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
        <link rel="shortcut icon" href="/favicon.ico"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <meta name="apple-mobile-web-app-title" content="MyWebSite"/>
        {/*<link rel="manifest" href="/site.webmanifest"/>*/}
        <title>{pageTitle(metadata.title as string)}</title>
        {metadata.keywords && <meta name="keywords" content={metadata.keywords as string}></meta>}
        {metadata.description && <meta name="description" content={metadata.description as string}></meta>}
        {isProd() && <GoogleAnalytics gaId="G-Z98PEGYB12"/>}
    </head>
    <body className={roboto.variable}>
    <JotaiProvider>
        <AppRouterCacheProvider options={{key: 'css', enableCssLayer: true}}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    </JotaiProvider>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
    <script type={'module'} async={true} src={lightningUrl}/>
    </body>
    </html>
}
