import 'server-only'

import React from "react";
import {PageMetadata} from "@/components/common/utils/page";

export default async function GlobalLayout(
    {
        lang,
        metadata,
        children
    }: {
        lang: string, metadata: PageMetadata,
        children: React.ReactNode
    }) {

    return <>
        {children}
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
                async
                crossOrigin="anonymous"
                defer={true}></script>
    </>
}
