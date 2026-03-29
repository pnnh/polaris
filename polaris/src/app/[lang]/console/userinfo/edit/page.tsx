import {getPathname} from "@/components/server/pathname";

import {useServerConfig} from "@/components/server/config";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {UserinfoEditForm} from "./form";
import {serverGetUserinfo} from "@/components/server/account/account";
import ConsoleLayout from "@/components/server/console/layout";
import {transKey} from "@/components/common/locales/normal";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const serverConfig = await useServerConfig()

    const userInfo = await serverGetUserinfo(serverConfig.INTERNAL_PORTAL_URL);
    if (!userInfo) {
        return <div>{transKey(lang, "console.userinfo.failed")}</div>
    }

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
    >
        <div>
            <UserinfoEditForm portalUrl={serverConfig.PUBLIC_PORTAL_URL} userInfo={userInfo} lang={lang}/>
        </div>
    </ConsoleLayout>
}
