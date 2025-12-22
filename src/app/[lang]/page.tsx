import React from 'react'
import {ContentLayout} from '@/components/server/content/layout'
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getTargetLang, unknownLanguage} from "@/components/common/language";
import {ToolBody} from "./tools/tool";
import {Request, Response} from 'express'

export async function Page(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang;
    if (!lang || getTargetLang(lang, unknownLanguage) === unknownLanguage) {
        response.status(404);
        return <div>404 Not Found</div>;
    }

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <ToolBody lang={lang}/>
    </ContentLayout>
}

