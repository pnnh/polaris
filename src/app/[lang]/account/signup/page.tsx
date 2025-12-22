import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {AccountLayout} from "@/components/server/account/layout";
import {css} from '@emotion/css'
import {SignupForm} from "./form";
import {useServerConfig} from "@/components/server/config";
import {langEn} from "@/atom/common/language";
import {transText} from "@/components/common/locales/normal";
import {Request, Response} from "express";

const styles = {
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

export async function Page(request: Request, response: Response) {
    const pathname = request.path


    const lang = request.params.lang || langEn
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const serverConfig = await useServerConfig()
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL
    return <AccountLayout lang={lang}
                          metadata={metadata}>
        <div className={styles.signupCard}>
            <div className={styles.signupTitle}>{transText(lang, '注册页面', 'Registration Page')}</div>
            <div className={styles.signupBody}>
                <SignupForm portalUrl={publicPortalUrl} lang={lang}/>
            </div>
        </div>
    </AccountLayout>
}
