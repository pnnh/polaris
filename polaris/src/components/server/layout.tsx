import 'server-only'
import {GoogleAnalytics} from "@next/third-parties/google";
import {Metadata} from "next";
import {pageTitle} from "@/utils/page";
import {isProd, usePublicConfig} from "@/services/server/config";
import React from "react";
import {encodeBase64String} from "@/utils/basex";

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
        {metadata.description && <meta name="description" content={metadata.description as string}></meta>}
        {isProd() && <GoogleAnalytics gaId="G-Z98PEGYB12"/>}
    </head>
    <body>
    <ServerData/>
    {children}
    <script>{`
        if('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js', {scope: '/'});
    }
    `}</script>
    </body>
    </html>
}

function ServerData() {
    const clientConfig = usePublicConfig()
    const configText = JSON.stringify(clientConfig)
    const encodedConfig = encodeBase64String(configText)
    return <div id={'serverData'}>{encodedConfig}</div>
}
