import 'server-only'

import React from "react";
import './global.css'
import { getTargetLang, langEnUS } from "@/components/common/language";
import { headers } from "next/headers";
import { JotaiProvider } from "@/components/client/content/provider";
import { getServerTheme } from "@/components/server/theme";

export default async function RootLayout({
    header,
    children,
    footer
}: {
    header?: React.ReactNode,
    children: React.ReactNode,
    footer?: React.ReactNode
}) {
    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const lang = getTargetLang(acceptLang, langEnUS)
    // const serverConfig = await useServerConfig()
    // const browserConfigString = JSON.stringify(usePublicConfig(serverConfig))
    // const encodedBrowserConfig = encodeBase58String(browserConfigString)

    const themeName = await getServerTheme()
    const isDarkTheme = themeName === 'dark'

    return <html>
        <head>
            <base href="/" />
            <meta charSet="utf-8" />
            <meta name="viewport"
                content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" />
            <meta name="renderer" content="webkit" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
            <meta name="robots" content="index,follow" />
            <meta httpEquiv="Content-Language" content={lang} />
            <link rel="icon" type="image/png" href="/icons/favicon-96x96.png" sizes="96x96" />
            <link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
            <link rel="shortcut icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" id="manifest-link" href={`/manifest/manifest_${lang}.json`} />
            <link rel="stylesheet" href="/assets/setup.css" />
            <title>HUABLE</title>
            {header}
        </head>
        <body lang={lang} className={isDarkTheme ? 'darkTheme' : 'lightTheme'}>
            <JotaiProvider>
                {children}
            </JotaiProvider>
            {footer}
        </body>
    </html>
}
