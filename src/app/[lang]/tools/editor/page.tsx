import {css} from '@emotion/css'
import {ContentLayout} from "@/components/server/content/layout";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import {langEn} from "@/atom/common/language";
import {PageMetadata} from "@/components/common/utils/page";
import {EditorComponent} from "@/app/[lang]/tools/editor/editor";
import {transKey} from "@/components/common/locales/normal";
import {Request, Response} from "express";

const styles = {
    editorPage: css`
        width: 960px;
        margin: 0 auto;
    `
};

export async function Home(request: Request, response: Response) {
    const pathname = request.path

    const lang = request.params.lang || langEn


    const metadata = new PageMetadata(lang, transKey(lang, 'toolEditorName'))
    metadata.description = transKey(lang, 'toolEditorDesc')
    return <ContentLayout lang={lang} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={styles.editorPage}>
            <EditorComponent lang={lang}/>
        </div>
    </ContentLayout>
}
