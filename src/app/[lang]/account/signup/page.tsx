import {getPathname} from "@/services/server/pathname";
import {PageMetadata, pageTitle} from "@/utils/page";
import AccountLayout from "@/components/server/account/layout";
import styles from './page.module.scss'
import {SignupForm} from "./form";
import {useServerConfig} from "@/services/server/config";
import {langEn} from "@/atom/common/language";
import {getLanguageProvider} from "@/services/common/language";

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

    const serverConfig = useServerConfig()
    const langProvider = getLanguageProvider(lang)
    return <AccountLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.signupCard}>
            <div className={styles.signupTitle}>注册页面</div>
            <div className={styles.signupBody}>
                <SignupForm portalUrl={serverConfig.PUBLIC_PORTAL_URL} lang={lang}/>
            </div>
        </div>
    </AccountLayout>
}
