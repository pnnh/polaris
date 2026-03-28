import {css} from "@/gen/styled/css";
import ContentLayout from "@/components/server/content/layout";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {getPathname} from "@/components/server/pathname";
import {aesUid, queryTool} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";

import RsaComponent from "./client";

const pageStyles = {
    pageContainer: css`
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

    const appInfo = await queryTool(lang, aesUid)
    if (!appInfo) {
        notFound()
    }

    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.pageContainer}>
            <RsaComponent lang={lang} appInfo={appInfo}/>
        </div>
    </ContentLayout>
}
