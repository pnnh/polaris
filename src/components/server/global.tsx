import 'server-only'

import './global.css'

import React, {Suspense} from "react";
import {GoogleAnalytics} from "@next/third-parties/google";
import {PageMetadata, pageTitle} from "@/utils/page";
import {isProd, usePublicConfig, useServerConfig} from "@/services/server/config";
import {JotaiProvider} from "@/components/client/content/provider";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import {ThemeProvider} from '@mui/material/styles';
import {lightTheme, darkTheme} from '@/components/client/theme';
import {encodeBase58String} from "@/atom/common/utils/basex";
import {getPathname} from "@/services/server/pathname";
import {langEn, langZh, replaceLanguageInPathname} from "@/atom/common/language";
import {getServerTheme} from "@/services/server/theme";

// 隔几秒重新验证下数据
export const revalidate = 1
export const dynamic = 'force-dynamic'

export default async function GlobalLayout({
                                               lang,
                                               metadata,
                                               children
                                           }: {
    lang: string, metadata: PageMetadata,
    children: React.ReactNode
}) {
    const rootPageTitle = pageTitle(lang,)

    const serverConfig = await useServerConfig()
    const selfUrl = serverConfig.PUBLIC_SELF_URL
    const browserConfigString = JSON.stringify(usePublicConfig(serverConfig))
    const encodedBrowserConfig = encodeBase58String(browserConfigString)
    const pathname = await getPathname()
    const langEnUrl = `${selfUrl}${replaceLanguageInPathname(pathname, langEn)}`
    const langZhUrl = `${selfUrl}${replaceLanguageInPathname(pathname, langZh)}`
    let langDefaultUrl = langEnUrl;
    if (pathname === '/') {
        langDefaultUrl = selfUrl
    }
    // const turnstileKey = serverConfig.CLOUDFLARE_PUBLIC_TURNSTILE
    const lightningUrl = serverConfig.PUBLIC_LIGHTNING_URL

    const themeName = await getServerTheme()
    let isDarkTheme = themeName === 'dark'
    let pageTheme = themeName === 'dark' ? darkTheme : lightTheme

    return <html lang={lang}>
    <head lang={lang}>
        <base href="/"/>
        <meta charSet="utf-8"/>
        <meta name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no"/>
        <meta name="renderer" content="webkit"/>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
        <meta name="robots" content="index,follow"/>
        <meta httpEquiv="Content-Language" content={lang}/>
        <link rel="icon" type="image/png" href="/icons/favicon-96x96.png" sizes="96x96"/>
        <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg"/>
        <link rel="shortcut icon" href="/favicon.ico"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <meta name="apple-mobile-web-app-title" content={rootPageTitle}/>
        <link rel="alternate" hrefLang="en" href={langEnUrl}/>
        <link rel="alternate" hrefLang="zh" href={langZhUrl}/>
        <title>{pageTitle(lang, metadata.title as string)}</title>
        {metadata.keywords && <meta name="keywords" content={metadata.keywords as string}></meta>}
        {metadata.description && <meta name="description" content={metadata.description as string}></meta>}
        {isProd() && <GoogleAnalytics gaId="G-Z98PEGYB12"/>}
    </head>
    <body lang={lang} className={isDarkTheme ? 'darkTheme' : 'lightTheme'}>
    <JotaiProvider>
        <AppRouterCacheProvider options={{key: 'css', enableCssLayer: true}}>
            <ThemeProvider theme={pageTheme}>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    </JotaiProvider>
    <input id="LGEnv" type="hidden" value={encodedBrowserConfig}/>
    <script type="module" src={lightningUrl} defer={true}></script>
    <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
            defer={true}></script>
    </body>
    </html>
}
