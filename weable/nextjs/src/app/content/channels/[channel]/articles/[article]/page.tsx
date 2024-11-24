import styles from './page.module.scss'
import React from 'react'
import {headers} from 'next/headers'
import {formatRfc3339} from '@pnnh/atom'
import {Metadata} from 'next'
import {generatorRandomString} from "@pnnh/atom";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {signinDomain} from "@/services/server/domain/domain";
import {NCPictureModel} from "@pnnh/venus-business";

export const metadata: Metadata = {
    title: '唯宝智图'
}

export default async function Home({params, searchParams}: {
    params: { viewer: string, channel: string, article: string },
    searchParams: Record<string, string>
}) {

    const domain = signinDomain()
    const url = `/channels/${params.channel}/pictures/${params.article}`
    const articleModel = await domain.makeGet<NCPictureModel | undefined>(url)

    if (articleModel == null) {
        return <div>遇到错误</div>
    }
    metadata.title = articleModel.title + ' - 唯宝智图'
    const article = articleModel
    const titleId = generatorRandomString(8)
    if (!article.body) {
        return <div>暂不支持的文章类型</div>
    }
    const headersList = headers()
    const clientIp = headersList.get('x-ip') || 'unknown'
    console.log('clientIp', clientIp)

    return <div className={styles.mainContainer}>
        <div className={styles.articleContainer}>
            <div className={styles.leftArea}>
                <div className={styles.articleInfo}>
                    <h1 className={styles.articleTitle} id={titleId}>{article.title}</h1>
                    <div className={styles.action}>
                        <RemoveRedEyeIcon fontSize={'small'}/><span>{article.discover}</span>&nbsp;
                        <AccessAlarmIcon fontSize={'small'}/><span>{formatRfc3339(article.update_time)}</span>
                    </div>
                    <div className={styles.articleBody}>
                        {article.title}
                    </div>
                </div>
            </div>
        </div>
    </div>
}
