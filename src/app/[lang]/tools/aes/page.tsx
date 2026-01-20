import ContentLayout from "@/components/server/content/layout";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {getPathname} from "@/components/server/pathname";
import {aesUid, queryApp} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";
import {PageMetadata} from "@/components/common/utils/page";
import AesComponent from "./aes";
import {css} from '@/gen/styled/css'

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const appInfo = await queryApp(lang, aesUid)
    if (!appInfo) {
        notFound()
    }

    const stylePageContainer = css`
        width: 960px;
        margin: 0 auto !important;
    `
    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={stylePageContainer}>
            <AesComponent lang={lang} appInfo={appInfo}/>
        </div>
    </ContentLayout>
}
