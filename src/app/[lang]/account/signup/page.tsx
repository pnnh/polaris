import {getPathname} from "@/components/server/pathname";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import AccountLayout from "@/components/server/account/layout";
import styles from './page.module.scss'
import {SignupForm} from "./form";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@/atom/common/language";
import {transText} from "@/components/common/locales/normal";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams

    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const serverConfig = await useServerConfig()
    return <AccountLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.signupCard}>
            <div className={styles.signupTitle}>{transText(lang, '注册页面', 'Registration Page')}</div>
            <div className={styles.signupBody}>
                <SignupForm portalUrl={serverConfig.PUBLIC_PORTAL_URL} lang={lang}/>
            </div>
        </div>
    </AccountLayout>
}
