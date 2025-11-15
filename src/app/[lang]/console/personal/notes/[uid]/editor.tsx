'use client'

import styles from "./editor.module.scss";
import React, {useEffect, useState} from "react";

import {TocItem} from "@/atom/common/models/toc";

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
    return <div className={styles.articleEditorContainer}>
        <div className={styles.sourceArea}>
            <textarea className={styles.sourceTextarea} value={body as string || ''}
                      onChange={(event) => onChange(event.target.value)}></textarea>
        </div>
        {/*<div className={styles.viewArea}>*/}
        {/*    /!*<BuildBodyHtml tocList={tocList} header={header} body={body}*!/*/}
        {/*    /!*               assetsUrl={assetsUrl} libUrl={'/abc'}/>*!/*/}
        {/*    预览区域，暂不支持预览*/}
        {/*</div>*/}
    </div>
}

