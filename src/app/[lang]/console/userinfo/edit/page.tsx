import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {useServerConfig} from "@/components/server/config";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {UserinfoEditForm} from "./form";
import {serverGetUserinfo} from "@/components/server/account/account";
import {langEn} from "@/atom/common/language";
import {ConsoleLayout} from "@/components/server/console/layout";
import {transText} from "@/components/common/locales/normal";
import {Request, Response} from "express";

export async function Page(request: Request, response: Response) {
    const pathname = request.path


    const lang = request.params.lang || langEn
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    const serverConfig = await useServerConfig()

    const userInfo = await serverGetUserinfo(serverConfig.INTERNAL_PORTAL_URL);
    if (!userInfo) {
        return <div>{transText(lang, '出错了', 'Failed')}</div>
    }

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang}
                          metadata={metadata}>
        <div>
            <UserinfoEditForm portalUrl={serverConfig.PUBLIC_PORTAL_URL} userInfo={userInfo} lang={lang}/>
        </div>
    </ConsoleLayout>
}
