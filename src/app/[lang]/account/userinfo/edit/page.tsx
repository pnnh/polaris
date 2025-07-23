import {getPathname} from "@/services/server/pathname";
import {PageMetadata, pageTitle} from "@/utils/page";
import {useServerConfig} from "@/services/server/config";
import ContentLayout from "@/components/server/content/layout";
import {CodeOk, SymbolUnknown} from "@/atom/common/models/protocol";
import {UserinfoEditForm} from "./form";
import {serverGetUserinfo} from "@/services/server/account/account";
import {langEn} from "@/atom/common/language";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL


    const userInfo = await serverGetUserinfo(portalUrl)
    if (!userInfo) {
        return <div>遇到错误</div>
    }

    return <ContentLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div>
            <UserinfoEditForm portalUrl={portalUrl} userInfo={userInfo}/>
        </div>
    </ContentLayout>
}
