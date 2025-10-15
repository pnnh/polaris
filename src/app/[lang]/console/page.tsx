import React from 'react'
import {PageMetadata, pageTitle} from "@/utils/page";
import {getPathname} from "@/services/server/pathname";
import {PLSelectResult, SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn, localText} from "@/atom/common/language";
import styles from './page.module.scss'
import ConsoleLayout from "@/components/server/console/layout";
import {useServerConfig} from "@/services/server/config";
import {serverGetUserinfo} from "@/services/server/account/account";
import {isAnonymousAccount} from "@/atom/common/models/account";
import {NeedLoginPage} from "@/components/server/content/needLogin";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL
    const currentUserInfo = await serverGetUserinfo(portalUrl);
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    if (!currentUserInfo || isAnonymousAccount(currentUserInfo)) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }

    return <ConsoleLayout userInfo={SymbolUnknown} lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.consolePage}>
            {localText(lang, '欢迎使用控制台', 'Welcome to the console')}
            <br/>
            {localText(lang, '请在左侧菜单中选择功能', 'Please select a function from the left menu')}
            <br/>
            {currentUserInfo.nickname}
        </div>
    </ConsoleLayout>
}


