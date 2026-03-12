import {css} from "@/gen/styled/css";
import ContentLayout from "@/components/server/content/layout";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {getPathname} from "@/components/server/pathname";

import {EditorComponent} from "@/app/[lang]/tools/editor/editor";

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

    return <ContentLayout lang={lang} searchParams={searchParamsValue} pathname={pathname}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.editorPage}>
            <EditorComponent lang={lang}/>
        </div>
    </ContentLayout>
}
