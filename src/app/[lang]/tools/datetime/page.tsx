import React from 'react'
import {css} from "@/gen/styled/css";
import {getPathname} from "@/components/server/pathname";
import DatetimeComponent from '@/components/client/tools/datetime/datetime';
import {langEn} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import ContentLayout from "@/components/server/content/layout";
import {SymbolUnknown} from "@pnnh/atom";

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

    const metadata = new PageMetadata(lang)
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={pageStyles.qrCodePage}>
            <DatetimeComponent lang={lang}/>
        </div>
    </ContentLayout>
}
