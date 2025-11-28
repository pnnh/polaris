'use client'

import {EditArea} from "./edit";
import {ListArea} from "./list";
import * as React from "react";

export function CommentsClient({lang, portalUrl, resource}: {
    lang: string,
    portalUrl: string,
    resource: string
}) {
    return <div className={'commentsContainer'}>
        <style jsx>{`
            .commentsContainer {
                padding: 1rem;
                overflow: hidden;
                background: var(--background-color);
                border-radius: 4px;
            }
        `}</style>
        <EditArea lang={lang} portalUrl={portalUrl} resource={resource}/>
        <ListArea lang={lang} portalUrl={portalUrl} resource={resource}/>
    </div>
}
