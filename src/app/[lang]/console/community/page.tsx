import React from 'react'
import {css} from "@/gen/styled/css";
import {PageMetadata, pageTitle} from "@/components/common/utils/page";
import {getPathname} from "@/components/server/pathname";
import {langEn} from "@pnnh/atom";
import GlobalLayout from "@/components/server/global";
import ComputerIcon from "@mui/icons-material/Computer";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";

const pageStyles = {
    communityPage: css`
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
    const metadata = new PageMetadata(lang)
    metadata.title = pageTitle(lang, '')

    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={pageStyles.communityPage}>
            社区目录主页
            <div className={pageStyles.libGrid}>
                <div className={pageStyles.libHeader}>
                    <a className={pageStyles.libLink}>最近笔记</a>
                    <a href={`/${lang}/console/community/articles`} className={pageStyles.libLink}>全部笔记</a>
                </div>
                <div className={pageStyles.libBody}>
                    <div className={pageStyles.libCard}>
                        <ComputerIcon/>
                        最近笔记1
                    </div>
                    <div className={pageStyles.libCard}>
                        <ComputerIcon/>
                        最近笔记2
                    </div>
                    <div className={pageStyles.libCard}>
                        <CloudQueueIcon/>
                        最近笔记3
                    </div>
                </div>
            </div>
            <div className={pageStyles.libGrid}>
                <div className={pageStyles.libHeader}>
                    <a className={pageStyles.libLink}>最近图片</a>
                    <a href={`/${lang}/console/community/images`} className={pageStyles.libLink}>全部图片</a>
                </div>
                <div className={pageStyles.libBody}>
                    <div className={pageStyles.libCard}>
                        <ComputerIcon/>
                        最近图片1
                    </div>
                    <div className={pageStyles.libCard}>
                        <ComputerIcon/>
                        最近图片2
                    </div>
                </div>
            </div>
            <div className={pageStyles.libGrid}>
                <div className={pageStyles.libHeader}>
                    <a className={pageStyles.libLink}>最近频道</a>
                    <a href={`/${lang}/console/community/channels`} className={pageStyles.libLink}>全部频道</a>
                </div>
                <div className={pageStyles.libBody}>
                    <div className={pageStyles.libCard}>
                        <ComputerIcon/>
                        最近频道1
                    </div>
                    <div className={pageStyles.libCard}>
                        <ComputerIcon/>
                        最近频道2
                    </div>
                    <div className={pageStyles.libCard}>
                        <CloudQueueIcon/>
                        最近频道3
                    </div>
                </div>
            </div>
        </div>
    </GlobalLayout>
}


