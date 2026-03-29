'use client'

import {EditArea} from "./edit";
import {ListArea} from "./list";
import * as React from "react";
import {css} from "@/gen/styled/css";

export function CommentsClient({lang, portalUrl, resource}: {
    lang: string,
    portalUrl: string,
    resource: string
}) {
    return <div className={commentStyles.commentsContainer}>
        <EditArea lang={lang} portalUrl={portalUrl} resource={resource}/>
        <ListArea lang={lang} portalUrl={portalUrl} resource={resource}/>
    </div>
}

const commentStyles = {
    commentsContainer: css`
        padding: 1rem;
        overflow: hidden;
        background: var(--background-color);
        border-radius: 4px;
    `
}
