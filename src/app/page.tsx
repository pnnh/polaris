import React, {Suspense} from 'react'
import {ContentLayout} from '@/components/server/content/layout'
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";

import {getTargetLang, langEnUS, unknownLanguage} from "@/components/common/language";
import {filterAcceptLanguage} from "@/components/server/language";
import {ToolBody} from "@/app/[lang]/tools/tool";
import {Request, Response} from 'express';
import {renderToString} from 'react-dom/server';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from "@/app/emotion";
import {usePublicConfig, useServerConfig} from "@/components/server/config";
import {encodeBase58String} from "@/atom/common/utils/basex";
import {getServerTheme} from "@/components/server/theme";
import {darkTheme, lightTheme} from "@/components/client/theme";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {CacheProvider} from "@emotion/react";

export async function HandleHomePage(request: Request, response: Response) {
    const pathname = request.path
    const acceptLang = request.get('Accept-Language') || langEnUS
    const lang = filterAcceptLanguage(acceptLang)

    const metadata = new PageMetadata(lang)

    const rootPageTitle = pageTitle(lang,)

    const serverConfig = await useServerConfig()
    const browserConfigString = JSON.stringify(usePublicConfig(serverConfig))
    const encodedBrowserConfig = encodeBase58String(browserConfigString)

    const themeName = await getServerTheme()
    let isDarkTheme = themeName === 'dark'
    let pageTheme = isDarkTheme ? darkTheme : lightTheme


    const cache = createEmotionCache(); // 每个请求新实例
    const {extractCriticalToChunks, constructStyleTagsFromChunks} = createEmotionServer(cache)

    const html = renderToString(
        <CacheProvider value={cache}>
            <ThemeProvider theme={pageTheme}>
                <CssBaseline/>
                <Suspense fallback={<div>Loading...</div>}>
                    <ContentLayout lang={lang} pathname={pathname}
                                   metadata={metadata} userInfo={SymbolUnknown}>
                        <ToolBody lang={lang}/>
                    </ContentLayout>
                </Suspense>
            </ThemeProvider>
        </CacheProvider>
    );
    const chunks = extractCriticalToChunks(html)
    const styles = constructStyleTagsFromChunks(chunks)


    // 检测传递的语言参数是否有效
    if (!lang || getTargetLang(lang, unknownLanguage) === unknownLanguage) {
        throw new Error(`Invalid language parameter: ${lang}`)
    }

    response.status(200)
        .header('Content-Type', 'text/html')
        .send(`<!DOCTYPE html>
        <html lang=${lang}>
        <head lang=${lang}>
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
            <meta name="apple-mobile-web-app-title" content=${rootPageTitle}/>
            <title>${pageTitle(lang, metadata.title as string)}</title>
            <meta name="keywords" content=${metadata.keywords as string}></meta>
            <meta name="description" content=${metadata.description as string}></meta>
            <link rel="manifest" id="manifest-link" href=${`/manifest/manifest_` + lang + `.json`}/>
            <link rel="stylesheet" href="/assets/setup.css"/>
            <script type="module" src="/setup.js" crossOrigin="anonymous"></script>
            ${styles}
        </head>
        <body lang=${lang} className=${isDarkTheme ? 'darkTheme' : 'lightTheme'}>
        <input id="LGEnv" type="hidden" value=${encodedBrowserConfig}/>
        <div id="root">${html}</div>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
                async
                crossOrigin="anonymous"
                defer={true}></script>
        </body>
        </html>
  `);


}


