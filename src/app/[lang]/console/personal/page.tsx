import React from 'react'
import {css} from "@/gen/styled/css";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {calcPagination} from "@pnnh/atom";
import {langEn} from "@pnnh/atom";
import {useServerConfig} from "@/components/server/config";
import {serverConsoleSelectArticles} from "@/components/personal/articles";
import GlobalLayout from "@/components/server/global";
import ComputerIcon from "@mui/icons-material/Computer";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

const pageStyles = {
    personalPage: css`
    `,
    libGrid: css`
        margin-top: 1rem;
    `,
    libHeader: css`
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        gap: 1rem;
        background-color: #f0f0f0;
    `,
    libLink: css`
        font-size: 1.2rem;
        color: #000;
        text-decoration: none;
        padding: 0.5rem 1rem;
        
        &:hover {
            background-color: #f0f0f0;
        }
    `,
    libBody: css`
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
        margin-top: 1rem;
    `,
    libCard: css`
        border: solid 1px #ccc;
        min-height: 4rem;
    `
}

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

    const selectData = await serverConsoleSelectArticles(serverConfig.INTERNAL_PORTAL_URL,
        lang, selectQuery)

    const pagination = calcPagination(page, selectData.count, pageSize)
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={pageStyles.personalPage}>
            个人目录主页
            <div className={pageStyles.libGrid}>
                <div className={pageStyles.libHeader}>
                    <a className={pageStyles.libLink}>最近笔记</a>
                    <a href={`/${lang}/console/personal/notes`} className={pageStyles.libLink}>全部笔记</a>
                </div>
                <div className={pageStyles.libBody}>
                    <div className={pageStyles.libCard}>
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


