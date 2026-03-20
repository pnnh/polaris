import React from 'react'
import {css} from "@/gen/styled/css";
import {SymbolUnknown} from "@pnnh/atom";
import {serverGetUserinfo} from "@/components/server/account/account";
import {useServerConfig} from "@/components/server/config";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import {AccountModel, isAnonymousAccount} from "@/components/common/models/account/account";
import {ManagementNavbar} from "@/components/server/management/navbar";
import {ManagementSidebar} from "@/components/server/management/sidebar";

const styles = {
    communityContainer: css`
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    `,
    templateNavbar: css`
        width: 100vw;
        background-color: var(--background-color);
        border-bottom: solid 1px #d3d3d3;
        flex-shrink: 0;
    `,
    communityBody: css`
        display: flex;
        flex-direction: row;
        flex: 1;
        overflow: hidden;
    `,
};

export default async function ManagementLayout(
    {
        children,
        pathname,
        searchParams,
        lang,
        userInfo,
    }: {
        children: React.ReactNode,
        pathname: string,
        searchParams: Record<string, string>,
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
    return <div className={styles.communityContainer}>
        <div className={styles.templateNavbar}>
            <ManagementNavbar pathname={pathname} searchParams={searchParams} lang={lang}
                              userInfo={currentUserInfo}/>
        </div>
        <div className={styles.communityBody}>
            <ManagementSidebar lang={lang}/>
            {children}
        </div>
    </div>
}
