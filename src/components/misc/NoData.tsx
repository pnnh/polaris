import 'server-only'
import ContentLayout from "@/components/server/content/layout";
import {SymbolUnknown} from "@pnnh/atom";
import React from "react";
import {NoData} from "@/components/common/empty";

export function NoDataPage({
                               lang,
                               pathname,
                               searchParams,
                               size, message
                           }: {
    lang: string,
    pathname: string,
    searchParams: Record<string, string>,
    size: 'small' | 'middle' | 'large', message?: string
}) {
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParams} pathname={pathname}
    >
        <NoData size={'middle'}/>
    </ContentLayout>
}
