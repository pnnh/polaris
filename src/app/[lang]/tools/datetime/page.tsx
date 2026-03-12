import React from 'react'
import {css} from "@/gen/styled/css";
import {getPathname} from "@/components/server/pathname";
import DatetimeComponent from '@/components/client/tools/datetime/datetime';
import {langEn, SymbolUnknown} from "@pnnh/atom";

import ContentLayout from "@/components/server/content/layout";

const pageStyles = {
    qrCodePage: css`
        width: 960px;
        margin: 0 auto;
    `
}

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams
 
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.qrCodePage}>
            <DatetimeComponent lang={lang}/>
        </div>
    </ContentLayout>
}
