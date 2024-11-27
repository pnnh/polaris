import styles from './page.module.scss'
import React from 'react'
import {Toolbar} from './partials/toolbar'
import {ArticleTable} from './partials/table'

export default async function Page({searchParams}: {
    searchParams: Record<string, string>
}) {
    console.debug('searchParams', searchParams)
    const url = '/admin/articles?' + 'page=1&size=20'
    //const result = await serverMakeHttpGetV2<PLSelectResult<PSArticleModel>>(url)

    return <div>
        <div className={styles.titleBar}>
            <Toolbar/>
        </div>
        <div className={styles.pageBody}>
            <ArticleTable result={{} as any} search={searchParams}/>
        </div>
    </div>
}
