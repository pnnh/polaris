import {getPathname} from "@/components/server/pathname";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import AccountLayout from "@/components/server/account/layout";
import {css} from "@/gen/styled/css";
import {SignupForm} from "./form";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@pnnh/atom";
import {transText} from "@/components/common/locales/normal";

const pageStyles = {
    signupCard: css`
        height: 600px;
        width: 600px;
        margin: 0 auto;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        background-color: #fff;
        text-align: center;
    `,
    signupTitle: css`
        font-size: 1.5rem;
        font-weight: 500;
        margin-bottom: 20px;
    `,
    signupBody: css`
        padding: 1rem;
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
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const serverConfig = await useServerConfig()
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <AccountLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={pageStyles.signupCard}>
            <div className={pageStyles.signupTitle}>{transText(lang, '注册页面', 'Registration Page')}</div>
            <div className={pageStyles.signupBody}>
                <SignupForm portalUrl={publicPortalUrl} lang={lang}/>
            </div>
        </div>
    </AccountLayout>
}
