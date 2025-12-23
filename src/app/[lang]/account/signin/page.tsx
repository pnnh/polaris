import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {AccountLayout} from "@/components/server/account/layout";
import {css} from '@emotion/css'
import {SigninForm} from "./form";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@/atom/common/language";

import {serverGetUserinfo} from "@/components/server/account/account";
import {LinkSession} from "@/app/[lang]/account/signin/link";
import {isAnonymousAccount} from "@/atom/common/models/account";
import {transText} from "@/components/common/locales/normal";
import {Request, Response} from "express";

const styles = {
    signinCard: css`
        height: 400px;
        width: 600px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: var(--background-color);
        text-align: center;
        color: var(--text-primary-color);
    `,
    signinTitle: css`
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 20px;
    `,
    signinBody: css`
        padding: 1rem;
    `
}

export async function Page(request: Request, response: Response) {
    const pathname = request.path


    const lang = request.params.lang || langEn
    const signinLink = request.query.link as string
    const linkApp = request.query.app as string
    const signinCallback = request.query.redirect as string

    const serverConfig = await useServerConfig()
    const internalPortalUrl = serverConfig.INTERNAL_PORTAL_URL
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL

    const userInfo = await serverGetUserinfo(internalPortalUrl)
    if (userInfo && !isAnonymousAccount(userInfo)) {
        if (signinLink && linkApp) {
            return <LinkSession lang={lang} portalUrl={publicPortalUrl} signinLink={signinLink as string}
                                linkApp={linkApp}
                                signinCallback={signinCallback}/>
        }
        return <div><a href={'/'}>{transText(lang, '前往首页', 'Go home page')}</a></div>
    }
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    return <AccountLayout lang={lang}
                          metadata={metadata}>
        <div className={styles.signinCard}>
            <div className={styles.signinTitle}>{transText(lang, '登录页面', 'Login Page')}</div>
            <div className={styles.signinBody}>
                <SigninForm portalUrl={publicPortalUrl} lang={lang} signinLink={signinLink}
                            linkApp={linkApp} signinCallback={signinCallback}/>
            </div>
        </div>
    </AccountLayout>
}
