import 'server-only'

import React, {Suspense} from "react";
import {GoogleAnalytics} from "@next/third-parties/google";
import {PageMetadata, pageTitle} from "@/utils/page";
import {isProd, usePublicConfig, useServerConfig} from "@/services/server/config";
import {JotaiProvider} from "@/components/client/content/provider";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v15-appRouter";
import {ThemeProvider} from '@mui/material/styles';
import {lightTheme, darkTheme} from '@/components/client/theme';
import {encodeBase58String} from "@/atom/common/utils/basex";
import {getServerTheme} from "@/services/server/theme";
import {getTargetLang, unknownLanguage} from "@/services/common/language";
import {notFound} from "next/navigation";
import {ServerComponentStyle, StyleItem} from "@/components/server/component";
import {ClientSetup} from "@/components/client/setup";

// 隔几秒重新验证下数据
export const revalidate = 1
export const dynamic = 'force-dynamic'

export default async function GlobalLayout(
    {
        lang,
        metadata,
        styleItems,
        children
    }: {
        lang: string, metadata: PageMetadata,
        styleItems?: StyleItem | StyleItem[] | undefined,
        children: React.ReactNode
    }) {
    const rootPageTitle = pageTitle(lang,)

    const serverConfig = await useServerConfig()
    const browserConfigString = JSON.stringify(usePublicConfig(serverConfig))
    const encodedBrowserConfig = encodeBase58String(browserConfigString)
    const lightningUrl = serverConfig.PUBLIC_LIGHTNING_URL

    const themeName = await getServerTheme()
    let isDarkTheme = themeName === 'dark'
    let pageTheme = themeName === 'dark' ? darkTheme : lightTheme

    // 检测传递的语言参数是否有效
    if (!lang || getTargetLang(lang, unknownLanguage) === unknownLanguage) {
        notFound()
    }
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
        <title>{pageTitle(lang, metadata.title as string)}</title>
        {metadata.keywords && <meta name="keywords" content={metadata.keywords as string}></meta>}
        {metadata.description && <meta name="description" content={metadata.description as string}></meta>}
        {isProd() && <GoogleAnalytics gaId="G-Z98PEGYB12"/>}
        {isDarkTheme ?
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-dark.min.css"
                  integrity="sha512-Njdz7T/p6Ud1FiTMqH87bzDxaZBsVNebOWmacBjMdgWyeIhUSFU4V52oGwo3sT+ud+lyIE98sS291/zxBfozKw=="
                  crossOrigin="anonymous" referrerPolicy="no-referrer"/> :
            <link rel="stylesheet"
                  href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.30.0/themes/prism-solarizedlight.min.css"
                  integrity="sha512-fibfhB71IpdEKqLKXP/96WuX1cTMmvZioYp7T6I+lTbvJrrjEGeyYdAf09GHpFptF8toQ32woGZ8bw9+HjZc0A=="
                  crossOrigin="anonymous" referrerPolicy="no-referrer"/>
        }
        <ServerComponentStyle styleItems={styleItems}></ServerComponentStyle>
    </head>
    <body lang={lang} className={isDarkTheme ? 'darkTheme' : 'lightTheme'}>
    <JotaiProvider>
        <AppRouterCacheProvider options={{key: 'css', enableCssLayer: true}}>
            <ThemeProvider theme={pageTheme}>
                <ClientSetup>
                    {children}
                </ClientSetup>
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
