import styles from './page.module.scss'
import React from 'react'
import {Toolbar} from './partials/toolbar'
import {ArticleTable} from './partials/table'
import {PLSelectResult} from '@pnnh/polaris-business'
import {PSArticleModel} from "@pnnh/polaris-business";
import {serverMakeHttpGetV2} from "@/services/server/fetch";

export default async function Page({searchParams}: {
    searchParams: Record<string, string>
}) {
    console.debug('searchParams', searchParams)
    const url = '/admin/articles?' + 'page=1&size=20'
    const result = await serverMakeHttpGetV2<PLSelectResult<PSArticleModel>>(url)

    return <div>
        <div className={styles.titleBar}>
            <Toolbar/>
        </div>
        <div className={styles.pageBody}>
            <ArticleTable result={result} search={searchParams}/>
        </div>
    </div>
}
