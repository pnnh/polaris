import React from 'react'
import styles from './layout.module.scss'
import {AccountModel, isAnonymousAccount} from "@/atom/common/models/account";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import GlobalLayout from "@/components/server/global";
import {PageMetadata, pageTitle} from "@/utils/page";
import {ConsoleSidebar} from "@/components/server/console/sidebar";
import {serverGetUserinfo} from "@/services/server/account/account";
import {useServerConfig} from "@/services/server/config";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import {StyleItem} from "@/components/server/component";

export default async function ConsoleLayout(
    {
        children,
        pathname,
        searchParams,
        metadata,
        lang,
        userInfo,
        styleItems
    }: {
        children: React.ReactNode,
        pathname: string,
        searchParams: Record<string, string>,
        metadata: PageMetadata,
        lang: string,
        styleItems?: StyleItem | StyleItem[] | undefined,
        userInfo: AccountModel | typeof SymbolUnknown
    }) {
    let currentUserInfo: AccountModel | undefined;
    const serverConfig = await useServerConfig()
    if (userInfo === SymbolUnknown) {
        const portalUrl = serverConfig.PUBLIC_PORTAL_URL
        currentUserInfo = await serverGetUserinfo(portalUrl);
    } else {
        currentUserInfo = userInfo;
    }

    if (!currentUserInfo || isAnonymousAccount(currentUserInfo)) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }
    return <GlobalLayout lang={lang} metadata={metadata} styleItems={styleItems}>
        <div className={styles.consoleContainer}>
            <ConsoleSidebar lang={lang}/>
            {children}
        </div>
    </GlobalLayout>
}
