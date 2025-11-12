import React from 'react'
import styles from './page.module.scss'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {langEn} from "@/atom/common/language";
import GlobalLayout from "@/components/server/global";
import ComputerIcon from "~/@mui/icons-material/Computer";
import CloudQueueIcon from "~/@mui/icons-material/CloudQueue";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ lang: string, channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const searchParamsValue = await searchParams
    const paramsValue = await params;
    const lang = paramsValue.lang || langEn

    let page = Number(searchParamsValue.page)
    if (isNaN(page)) {
        page = 1
    }
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.communityPage}>
            社区目录主页
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    <a className={styles.libLink}>最近笔记</a>
                    <a href={`/${lang}/console/community/articles`} className={styles.libLink}>全部笔记</a>
                </div>
                <div className={styles.libBody}>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        最近笔记1
                    </div>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        最近笔记2
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        最近笔记3
                    </div>
                </div>
            </div>
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    <a className={styles.libLink}>最近图片</a>
                    <a href={`/${lang}/console/community/images`} className={styles.libLink}>全部图片</a>
                </div>
                <div className={styles.libBody}>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        最近图片1
                    </div>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        最近图片2
                    </div>
                </div>
            </div>
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    <a className={styles.libLink}>最近频道</a>
                    <a href={`/${lang}/console/community/channels`} className={styles.libLink}>全部频道</a>
                </div>
                <div className={styles.libBody}>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        最近频道1
                    </div>
                    <div className={styles.libCard}>
                        <ComputerIcon/>
                        最近频道2
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        最近频道3
                    </div>
                </div>
            </div>
        </div>
    </GlobalLayout>
}


