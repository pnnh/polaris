import React from 'react'
import styles from './layout.module.scss'
import {SymbolUnknown} from "@pnnh/atom";
import GlobalLayout from "@/components/server/global";
import {PageMetadata} from "@/components/common/utils/page";
import {ConsoleSidebar} from "@/components/server/console/sidebar";
import {serverGetUserinfo} from "@/components/server/account/account";
import {useServerConfig} from "@/components/server/config";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import {AccountModel, isAnonymousAccount} from "@/components/common/models/account/account";

export default async function ConsoleLayout(
    {
        children,
        pathname,
        searchParams,
        metadata,
        lang,
        userInfo,
    }: {
        children: React.ReactNode,
        pathname: string,
        searchParams: Record<string, string>,
        metadata: PageMetadata,
        lang: string,
        userInfo: AccountModel | typeof SymbolUnknown
    }) {
    let currentUserInfo: AccountModel | undefined;
    const serverConfig = await useServerConfig()
    if (userInfo === SymbolUnknown) {
        const portalUrl = serverConfig.INTERNAL_PORTAL_URL
        currentUserInfo = await serverGetUserinfo(portalUrl);
    } else {
        currentUserInfo = userInfo;
    }

    if (!currentUserInfo || isAnonymousAccount(currentUserInfo)) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.consoleContainer}>
            <ConsoleSidebar lang={lang}/>
            {children}
        </div>
    </GlobalLayout>
}
