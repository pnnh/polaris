import {css} from "@/gen/styled/css";
import ContentLayout from "@/components/server/content/layout";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {getPathname} from "@/components/server/pathname";
import {base58Uid, queryApp} from "@/components/server/tools/tools";
import {notFound} from "next/navigation";
import {PageMetadata} from "@/components/common/utils/page";
import Hash256Component from "./hash256";

const pageStyles = {
    base58Page: css`
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

    const appInfo = await queryApp(lang, base58Uid)
    if (!appInfo) {
        notFound()
    }

    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={pageStyles.base58Page}>
            <Hash256Component lang={lang} appInfo={appInfo}/>
        </div>
    </ContentLayout>
}
