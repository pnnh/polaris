import {css} from "@/gen/styled/css";
import ContentLayout from "@/components/server/content/layout";
import {SymbolUnknown} from "@pnnh/atom";
import {getPathname} from "@/components/server/pathname";
import {langEn} from "@pnnh/atom";
import {PageMetadata} from "@/components/common/utils/page";
import {EditorComponent} from "@/app/[lang]/tools/editor/editor";
import {transKey} from "@/components/common/locales/normal";

const pageStyles = {
    editorPage: css`
        width: 960px;
        margin: 0 auto;
    `
}

export default async function Home({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn
    const searchParamsValue = await searchParams

    const metadata = new PageMetadata(lang, transKey(lang, 'toolEditorName'))
    metadata.description = transKey(lang, 'toolEditorDesc')
    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata} userInfo={SymbolUnknown}>
        <div className={pageStyles.editorPage}>
            <EditorComponent lang={lang}/>
        </div>
    </ContentLayout>
}
