import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {langEn, localText} from "@/atom/common/language";
import styles from './page.module.scss'
import {useServerConfig} from "@/components/server/config";
import {serverGetUserinfo} from "@/components/server/account/account";
import {isAnonymousAccount} from "@/atom/common/models/account";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import GlobalLayout from "@/components/server/global";
import {ConsoleLibraryFilterBar} from "@/app/[lang]/console/libraries/filter";
import {ConsoleLibraryMiddleBody} from "@/app/[lang]/console/libraries/library";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
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

    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.consolePage}>
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    <ConsoleLibraryFilterBar lang={lang} keyword={''}/>
                </div>
                <ConsoleLibraryMiddleBody lang={lang} portalUrl={portalUrl}/>
            </div>
        </div>
    </GlobalLayout>
}


