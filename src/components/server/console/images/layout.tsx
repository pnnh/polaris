import React from 'react'
import styles from './layout.module.scss'
import {AccountModel, isAnonymousAccount} from "@/atom/common/models/account";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import GlobalLayout from "@/components/server/global";
import {PageMetadata} from "@/components/common/utils/page";
import {serverGetUserinfo} from "@/components/server/account/account";
import {useServerConfig} from "@/components/server/config";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import {StyleItem} from "@/components/server/component";
import {ConsoleImageSidebar} from "@/components/server/console/images/sidebar";

export default async function ConsoleImageLayout(
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
        const portalUrl = serverConfig.INTERNAL_PORTAL_URL
        currentUserInfo = await serverGetUserinfo(portalUrl);
    } else {
        currentUserInfo = userInfo;
    }

    if (!currentUserInfo || isAnonymousAccount(currentUserInfo)) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }
    return <GlobalLayout lang={lang} metadata={metadata} styleItems={styleItems}>
        <div className={styles.consoleContainer}>
            <ConsoleImageSidebar lang={lang}/>
            {children}
        </div>
    </GlobalLayout>
}
