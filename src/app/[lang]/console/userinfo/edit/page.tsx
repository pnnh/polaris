import {getPathname} from "@/components/server/pathname";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {useServerConfig} from "@/components/server/config";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {UserinfoEditForm} from "./form";
import {serverGetUserinfo} from "@/components/server/account/account";
import {langEn} from "@/atom/common/language";
import ConsoleLayout from "@/components/server/console/layout";
import {transText} from "@/components/common/locales/normal";

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
        return <div>{transText(lang, '出错了', 'Failed')}</div>
    }

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div>
            <UserinfoEditForm portalUrl={portalUrl} userInfo={userInfo} lang={lang}/>
        </div>
    </ConsoleLayout>
}
