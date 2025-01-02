import 'server-only'
import {GoogleAnalytics} from "@next/third-parties/google";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import {isProd, usePublicConfig} from "@/services/server/config";
import React from "react";
import {encodeBase64String} from "@/atom/common/utils/basex";
import {JotaiProvider} from "@/components/client/content/provider";
import {TurnstileClient} from "@/components/client/cloudflare/turnstile";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from 'next/font/google';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/components/client/theme';

const roboto = Roboto({
      weight: ['300', '400', '500', '700'],
      subsets: ['latin'],
      display: 'swap',
      variable: '--font-roboto',
    });

export function HtmlLayout({
                               metadata,
                               children
                           }: { metadata: Metadata, children: React.ReactNode }) {
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
        <link rel="manifest" href="/site.webmanifest"/>
        <title>{pageTitle(metadata.title as string)}</title>
        {metadata.keywords && <meta name="keywords" content={metadata.keywords as string}></meta>}
        {metadata.description && <meta name="description" content={metadata.description as string}></meta>}
        {isProd() && <GoogleAnalytics gaId="G-Z98PEGYB12"/>}
    </head>
    <body  className={roboto.variable}>
    <ServerData/>
    <JotaiProvider>
        <AppRouterCacheProvider  options={{ key: 'css' ,enableCssLayer: true }}>
            <ThemeProvider theme={theme}>
        {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    </JotaiProvider>
    <script>{`
if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'});
}
    `}</script>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
    <TurnstileClient/>
    </body>
    </html>
}

function ServerData() {
    const clientConfig = usePublicConfig()
    const configText = JSON.stringify(clientConfig)
    const encodedConfig = encodeBase64String(configText)
    return <div id={'serverData'}>{encodedConfig}</div>
}
