import React from 'react'
import {ContentPublicNavbar} from "@/components/server/content/partials/navbar";
import styles from './layout.module.scss'
import {Metadata} from "next";
import {AccountModel} from "@/atom/common/models/account";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {useServerConfig} from "@/services/server/config";
import {serverGetUserinfo} from "@/atom/server/account/account";

export const templateBodyId = 'globalTemplateBody'

export default async function ArticleReadLayout({
                                                    children,
                                                    pathname,
                                                    searchParams,
                                                    metadata,
                                                    lang,
                                                    userInfo
                                                }: {
    children: React.ReactNode,
    pathname: string,
    searchParams: Record<string, string>,
    metadata: Metadata,
    lang: string,
    userInfo: AccountModel | typeof SymbolUnknown
}) {
    let currentUserInfo: AccountModel;
    if (userInfo === SymbolUnknown) {
        const serverConfig = useServerConfig()
        const portalUrl = serverConfig.PUBLIC_PORTAL_URL
        currentUserInfo = await serverGetUserinfo(portalUrl);
    } else {
        currentUserInfo = userInfo;
    }
    return <div className={styles.templateContainer}>
        <div>
            <ContentPublicNavbar pathname={pathname} searchParams={searchParams} lang={lang}
                                 userInfo={currentUserInfo}/>
        </div>
        <div id={templateBodyId} className={styles.templateBody}>
            <div className={styles.bodyContainer}>
                {children}
            </div>
        </div>
    </div>
}
