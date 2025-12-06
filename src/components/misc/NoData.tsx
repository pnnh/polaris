import 'server-only'

import {PageMetadata} from "@/components/common/utils/page";
import ContentLayout from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import React from "react";
import {NoData} from "@/components/common/empty";

export function NoDataPage({
                               lang,
                               pathname,
                               searchParams,
                               metadata,
                               size, message
                           }: {
    lang: string,
    pathname: string,
    searchParams: Record<string, string>,
    metadata: PageMetadata, size: 'small' | 'middle' | 'large', message?: string
}) {
    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParams} pathname={pathname}
                          metadata={metadata}>
        <NoData size={'middle'}/>
    </ContentLayout>
}
