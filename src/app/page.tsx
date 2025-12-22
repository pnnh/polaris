import React from 'react'
import {ContentLayout} from '@/components/server/content/layout'
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {PageMetadata} from "@/components/common/utils/page";

import {langEnUS} from "@/components/common/language";
import {filterAcceptLanguage} from "@/components/server/language";
import {ToolBody} from "@/app/[lang]/tools/tool";
import {Request} from 'express';

export async function HandleHomePage(request: Request) {
    const pathname = request.path
    const acceptLang = request.get('Accept-Language') || langEnUS
    const lang = filterAcceptLanguage(acceptLang)

    const metadata = new PageMetadata(lang)
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <ToolBody lang={lang}/>
    </ContentLayout>
}


