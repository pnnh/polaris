import {getPathname} from "@/services/server/pathname";
import {PageMetadata, pageTitle} from "@/utils/page";
import AccountLayout from "@/components/server/account/layout";
import styles from "./page.module.scss";
import {SigninForm} from "./form";
import {useServerConfig} from "@/services/server/config";
import {langEn} from "@/atom/common/language";
import GlobalLayout from "@/components/server/global";
import {getLanguageProvider} from "@/services/common/language";
import {serverGetUserinfo} from "@/atom/server/account/account";
import {func} from "prop-types";
import {LinkSession} from "@/app/[lang]/account/signin/link";
import {isAnonymousAccount} from "@/atom/common/models/account";

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

    const serverConfig = useServerConfig()
    const portalUrl = serverConfig.PUBLIC_PORTAL_URL

    const userInfo = await serverGetUserinfo(portalUrl)
    if (userInfo && !isAnonymousAccount(userInfo)) {
        if (signinLink && linkApp) {
            return <LinkSession lang={lang} portalUrl={portalUrl} signinLink={signinLink} linkApp={linkApp}/>
        }
        return <div>您已成功登录，点此<a href={'/'}>前往首页</a></div>
    }
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')
    const langProvider = getLanguageProvider(lang)
    return <GlobalLayout lang={lang} metadata={metadata}>
        <AccountLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                       metadata={metadata}>
            <div className={styles.signinCard}>
                <div className={styles.signinTitle}>登录页面</div>
                <div className={styles.signinBody}>
                    <SigninForm portalUrl={serverConfig.PUBLIC_PORTAL_URL} lang={lang} signinLink={signinLink}
                                linkApp={linkApp}/>
                </div>
            </div>
        </AccountLayout>
    </GlobalLayout>
}
