import {ContentLayout} from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";
import {aesUid, queryApp} from "@/components/server/tools/tools";
import {PageMetadata} from "@/components/common/utils/page";
import AesComponent from "./aes";
import {Request, Response} from "express";
import {css} from "@emotion/css";

export async function Home(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn


    const appInfo = queryApp(lang, aesUid)
    if (!appInfo) {
        response.status(404).send("Not Found");
        return;
    }

    const stylePageContainer = css`
        width: 960px;
        margin: 0 auto !important;
    `
    const metadata = new PageMetadata(lang, appInfo.name)
    metadata.description = appInfo.description
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={stylePageContainer}>
            <AesComponent lang={lang}/>
        </div>
    </ContentLayout>
}
