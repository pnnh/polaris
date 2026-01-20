import {css} from "@/gen/styled/css";
import React from "react";

import {TocItem} from "@pnnh/atom";

const editorStyles = {
    articleEditorContainer: css`
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        background: var(--background-color);
    `,
    sourceArea: css`
        width: 50%;
        scrollbar-width: thin;
    `,
    sourceTextarea: css`
        width: 100%;
        height: 100%;
        scrollbar-width: thin;
        resize: none;
        border: 1px solid var(--border-color);
    `
}

export function ConsoleArticleEditor({
                                         portalUrl, tocList, header, body, assetsUrl, onChange
                                     }: {
    portalUrl: string,
    tocList: Array<TocItem>,
    header: string,
    body: unknown,
    assetsUrl: string,
    onChange: (body: string) => void
}) {
    // const [bodyText, setBodyText] = useState<string>(body as string || '');
    return <div className={editorStyles.articleEditorContainer}>
        <div className={editorStyles.sourceArea}>
            <textarea className={editorStyles.sourceTextarea} value={body as string || ''}
                      onChange={(event) => onChange(event.target.value)}></textarea>
        </div>
        {/*<div className={editorStyles.viewArea}>*/}
        {/*    /!*<BuildBodyHtml tocList={tocList} header={header} body={body}*!/*/}
        {/*    /!*               assetsUrl={assetsUrl} libUrl={'/abc'}/>*!/*/}
        {/*    预览区域，暂不支持预览*/}
        {/*</div>*/}
    </div>
}

