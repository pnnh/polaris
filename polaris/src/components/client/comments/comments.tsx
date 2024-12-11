'use client'

import './comments.scss'
import {EditArea} from "./edit";
import {ListArea} from "./list";
import * as React from "react";

export function CommentsClient({mode, lang, assetsUrl}: { mode?: string, lang?: string, assetsUrl: string }) {
    return <div className={'commentsContainer'}>
        <EditArea mode={mode} lang={lang} assetsUrl={assetsUrl}/>
        <ListArea mode={mode} lang={lang} assetsUrl={assetsUrl}/>
    </div>
}
