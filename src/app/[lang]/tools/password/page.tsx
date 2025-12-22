import {css} from '@emotion/css';
import {ContentLayout} from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";
import {passwordUid, queryApp} from "@/components/server/tools/tools";
import {PageMetadata} from "@/components/common/utils/page";
import RandomPasswordPage from "@/app/[lang]/tools/password/password";
import {Request, Response} from "express";

const styles = {
    passwordPage: css`
        width: 960px;
        margin: 0 auto;
    `
};

export async function Home(request: Request, response: Response) {

    const pathname = request.path

    const lang = request.params.lang || langEn


    const appInfo = queryApp(lang, passwordUid)
    if (!appInfo) {

        response.status(404).send("Not Found");
        return;
    }

    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={styles.passwordPage}>
            <RandomPasswordPage lang={lang}/>
        </div>
    </ContentLayout>
}
