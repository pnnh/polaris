'use client'

import styles from './comments.module.scss'
import {EditArea} from "./edit";
import {ListArea} from "./list";
import * as React from "react";

export function CommentsClient({lang, portalUrl, resource}: {
    lang: string,
    portalUrl: string,
    resource: string
}) {
    return <div className={styles.commentsContainer}>
        <EditArea lang={lang} portalUrl={portalUrl} resource={resource}/>
        <ListArea lang={lang} portalUrl={portalUrl} resource={resource}/>
    </div>
}
