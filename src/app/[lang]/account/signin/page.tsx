import {getPathname} from "@/components/server/pathname";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import AccountLayout from "@/components/server/account/layout";
import styles from "./page.module.scss";
import {SigninForm} from "./form";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@/atom/common/language";
import GlobalLayout from "@/components/server/global";

import {serverGetUserinfo} from "@/components/server/account/account";
import {LinkSession} from "@/app/[lang]/account/signin/link";
import {isAnonymousAccount} from "@/atom/common/models/account";
import {transText} from "@/components/common/locales/normal";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const signinLink = searchParamsValue.link
    const linkApp = searchParamsValue.app
    const signinCallback = searchParamsValue.redirect

    const serverConfig = await useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL

    const userInfo = await serverGetUserinfo(portalUrl)
    if (userInfo && !isAnonymousAccount(userInfo)) {
        if (signinLink && linkApp) {
            return <LinkSession lang={lang} portalUrl={portalUrl} signinLink={signinLink} linkApp={linkApp}
                                signinCallback={signinCallback}/>
        }
        return <div><a href={'/'}>{transText(lang, '前往首页', 'Go home page')}</a></div>
    }
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    return <GlobalLayout lang={lang} metadata={metadata}>
        <AccountLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                       metadata={metadata}>
            <div className={styles.signinCard}>
                <div className={styles.signinTitle}>{transText(lang, '登录页面', 'Login Page')}</div>
                <div className={styles.signinBody}>
                    <SigninForm portalUrl={serverConfig.PUBLIC_PORTAL_URL} lang={lang} signinLink={signinLink}
                                linkApp={linkApp} signinCallback={signinCallback}/>
                </div>
            </div>
        </AccountLayout>
    </GlobalLayout>
}
