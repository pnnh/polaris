import React from 'react'
import styles from './page.module.scss'
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {calcPagination} from "@/atom/common/utils/pagination";
import {langEn} from "@/atom/common/language";
import {useServerConfig} from "@/components/server/config";
import {serverConsoleSelectArticles} from "@/components/server/articles/articles";
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
    const pageSize = 10
    const channelPk = searchParamsValue.channel

    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    const selectQuery = {
        sort: searchParamsValue.sort,
        filter: searchParamsValue.filter,
        page,
        size: pageSize,
        channel: channelPk
    }
    const serverConfig = await useServerConfig()

    const selectData = await serverConsoleSelectArticles(serverConfig.PUBLIC_PORTAL_URL,
        lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.personalPage}>
            个人目录主页
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    <a className={styles.libLink}>最近笔记</a>
                    <a href={`/${lang}/console/personal/notes`} className={styles.libLink}>全部笔记</a>
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
                        <ComputerIcon/>
                        <a href={`/${lang}/console/personal/images`} className={styles.libLink}>本地图片库</a>
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        最近笔记库
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        <a href={`/${lang}/console/personal/images`} className={styles.libLink}>最近图片库</a></div>

                </div>
            </div>
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    <a className={styles.libLink}>最近图片</a>
                    <a href={`/${lang}/console/personal`} className={styles.libLink}>个人主页</a>
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
                        <ComputerIcon/>
                        <a href={`/${lang}/console/personal/images`} className={styles.libLink}>本地图片库</a>
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        最近笔记库
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        <a href={`/${lang}/console/personal/images`} className={styles.libLink}>最近图片库</a></div>

                </div>
            </div>
            <div className={styles.libGrid}>
                <div className={styles.libHeader}>
                    <a className={styles.libLink}>最近资料库</a>
                    <a href={`/${lang}/console/personal`} className={styles.libLink}>完整列表</a>
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
                        <ComputerIcon/>
                        <a href={`/${lang}/console/personal/images`} className={styles.libLink}>本地图片库</a>
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        最近笔记库
                    </div>
                    <div className={styles.libCard}>
                        <CloudQueueIcon/>
                        <a href={`/${lang}/console/personal/images`} className={styles.libLink}>最近图片库</a></div>

                </div>
            </div>
        </div>
    </GlobalLayout>
}


