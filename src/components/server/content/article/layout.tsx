import React from 'react'
import {ContentPublicNavbar} from "@/components/server/content/partials/navbar";
import styles from './layout.module.scss'
import {AccountModel} from "@/atom/common/models/account";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {useServerConfig} from "@/services/server/config";
import {serverGetUserinfo} from "@/services/server/account/account";
import GlobalLayout from "@/components/server/global";
import {PageMetadata} from "@/utils/page";
import {getLanguageProvider} from "@/services/common/language";

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
    metadata: PageMetadata,
    lang: string,
    userInfo: AccountModel | typeof SymbolUnknown
}) {
    let currentUserInfo: AccountModel | undefined;
    if (userInfo === SymbolUnknown) {
        const serverConfig = await useServerConfig()
        const portalUrl = serverConfig.PUBLIC_PORTAL_URL
        currentUserInfo = await serverGetUserinfo(portalUrl);
    } else {
        currentUserInfo = userInfo;
    }
    const langProvider = getLanguageProvider(lang)
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.templateContainer}>
            <div className={styles.templateNavbar}>
                <ContentPublicNavbar pathname={pathname} searchParams={searchParams} langProvider={langProvider}
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
