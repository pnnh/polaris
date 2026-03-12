import React from 'react'

import {css} from "@/gen/styled/css";
import {useServerConfig} from "@/components/server/config";
import {serverGetUserinfo} from "@/components/server/account/account";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import ConsoleLayout from "@/components/server/console/layout";
import {ConsoleLibraryFilterBar} from "./filter";
import {ConsoleLibraryMiddleBody} from "./library";
import {isAnonymousAccount} from "@/components/common/models/account/account";
import {langEn} from "@pnnh/atom";
import {getPathname} from "@/components/server/pathname";

const pageStyles = {
    consolePage: css`
    `,
    libGrid: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
    `,
    libHeader: css`
        display: flex;
        flex-direction: row;
        gap: 1rem;
    `
}

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    const serverConfig = await useServerConfig()
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const currentUserInfo = await serverGetUserinfo(serverConfig.INTERNAL_PORTAL_URL);

    if (!currentUserInfo || isAnonymousAccount(currentUserInfo)) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }

    return <ConsoleLayout lang={lang} pathname={pathname} searchParams={searchParamsValue} userInfo={currentUserInfo}>
        <div className={pageStyles.consolePage}>
            <div className={pageStyles.libGrid}>
                <div className={pageStyles.libHeader}>
                    <ConsoleLibraryFilterBar lang={lang} keyword={''} portalUrl={publicPortalUrl}/>
                </div>
                <ConsoleLibraryMiddleBody lang={lang} portalUrl={publicPortalUrl}/>
            </div>
        </div>
    </ConsoleLayout>
}


