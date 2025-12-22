import React from 'react'

import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import {ContentLayout} from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {ToolBody} from "./tool";
import {Request, Response} from 'express'

export async function Page(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn


    const metadata = new PageMetadata(lang)
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <ToolBody lang={lang}/>
    </ContentLayout>
}
