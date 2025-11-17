import React from 'react'
import {ContentPublicNavbar} from "@/components/server/content/partials/navbar";
import styles from './layout.module.scss'
import {AccountModel} from "@/atom/common/models/account";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {serverGetUserinfo} from "@/components/server/account/account";
import {useServerConfig} from "@/components/server/config";
import GlobalLayout from "@/components/server/global";
import {PageMetadata} from "@/components/common/utils/page";

export const templateBodyId = 'globalTemplateBody'

export default async function ContentLayout({
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
    metadata: PageMetadata,
    lang: string,
    userInfo: AccountModel | typeof SymbolUnknown,
}) {
    let currentUserInfo: AccountModel | undefined;
    const serverConfig = await useServerConfig()
    if (userInfo === SymbolUnknown) {
        const portalUrl = serverConfig.INTERNAL_PORTAL_URL
        currentUserInfo = await serverGetUserinfo(portalUrl);
    } else {
        currentUserInfo = userInfo;
    }
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.templateContainer}>
            <div className={styles.templateNavbar}>
                <ContentPublicNavbar pathname={pathname} searchParams={searchParams} lang={lang}
                                     userInfo={currentUserInfo}/>
            </div>
            <div id={templateBodyId} className={styles.templateBody}>
                <div className={styles.bodyContainer}>
                    {children}
                </div>
            </div>
        </div>
    </GlobalLayout>
}
