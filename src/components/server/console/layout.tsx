import React from 'react'
import {css} from '@emotion/css'
import {AccountModel, isAnonymousAccount} from "@/atom/common/models/account";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {PageMetadata} from "@/components/common/utils/page";
import {ConsoleSidebar} from "@/components/server/console/sidebar";
import {serverGetUserinfo} from "@/components/server/account/account";
import {useServerConfig} from "@/components/server/config";
import {NeedLoginPage} from "@/components/server/content/needLogin";

const styles = {
    consoleContainer: css`
        display: flex;
        flex-direction: row;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    `
};

export async function ConsoleLayout(
    {
        children,
        metadata,
        lang,
        userInfo,
    }: {
        children: React.ReactNode,
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
    return <div className={styles.consoleContainer}>
        <ConsoleSidebar lang={lang}/>
        {children}
    </div>
}
