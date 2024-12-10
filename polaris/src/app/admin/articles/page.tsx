import styles from './page.module.scss'
import React from 'react'
import {AdminLayout} from "@/components/server/admin/layout";
import {AdminArticleToolbar} from "@/components/client/admin/articles/toolbar";
import {AdminArticleTable} from "@/components/client/admin/articles/table";
import {PLSelectResult} from "@/models/common/protocol";
import {PSArticleModel} from "@/models/common/article";

export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    // console.debug('searchParams', searchParams)
    // const url = '/admin/articles?' + 'page=1&size=20'
    //const result = await serverMakeHttpGetV2<PLSelectResult<PSArticleModel>>(url)
    const result = {} as PLSelectResult<PSArticleModel>

    return (<AdminLayout>
        <div>
            <div className={styles.titleBar}>
                <AdminArticleToolbar/>
            </div>
            <div className={styles.pageBody}>
                <AdminArticleTable result={result} search={await searchParams}/>
            </div>
        </div>
    </AdminLayout>)
}
