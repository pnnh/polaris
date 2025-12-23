import React from 'react'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {langEn} from "@/atom/common/language";
import {css} from '@emotion/css'
import {useServerConfig} from "@/components/server/config";
import {serverGetUserinfo} from "@/components/server/account/account";
import {isAnonymousAccount} from "@/atom/common/models/account";
import {NeedLoginPage} from "@/components/server/content/needLogin";
import {ConsoleLibraryFilterBar} from "./filter";
import {ConsoleLibraryMiddleBody} from "./library";
import {Request, Response} from "express";

const styles = {
    consolePage: css`
        width: 1024px;
        margin: 0 auto;
    `,
    libGrid: css`
        margin-top: 1rem;
    `,
    libHeader: css`
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        gap: 1rem;
        background-color: #f0f0f0;
    `,
    libLink: css`
        font-size: 1.2rem;
        color: #000;
        text-decoration: none;
        padding: 0.5rem 1rem;

        &:hover {
            background-color: #f0f0f0;
        }
    `
};

export async function Page(request: Request, response: Response) {

    const lang = request.params.lang || langEn

    const serverConfig = await useServerConfig()
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    const currentUserInfo = await serverGetUserinfo(serverConfig.INTERNAL_PORTAL_URL);
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    if (!currentUserInfo || isAnonymousAccount(currentUserInfo)) {
        return <NeedLoginPage lang={lang}></NeedLoginPage>
    }

    return <div className={styles.consolePage}>
        <div className={styles.libGrid}>
            <div className={styles.libHeader}>
                <ConsoleLibraryFilterBar lang={lang} keyword={''} portalUrl={publicPortalUrl}/>
            </div>
            <ConsoleLibraryMiddleBody lang={lang} portalUrl={publicPortalUrl}/>
        </div>
    </div>
}


