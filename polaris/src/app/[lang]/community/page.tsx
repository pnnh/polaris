import React from 'react'
import {css} from "@/gen/styled/css";

import {getPathname} from "@/components/server/pathname";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import {Cloud, Monitor} from "lucide-react";
import ConsoleLayout from "@/components/server/console/layout";

const pageStyles = {
    communityPage: css`
        width: 100%;
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

    return <ConsoleLayout lang={lang} pathname={pathname} searchParams={searchParamsValue}
                          userInfo={SymbolUnknown}>
        <div className={pageStyles.communityPage}>
            社区目录主页

            <div className={pageStyles.libGrid}>
                <div className={pageStyles.libHeader}>
                    <a className={pageStyles.libLink}>全部频道</a>
                    <a href={`/${lang}/community/channels`} className={pageStyles.libLink}>全部频道</a>
                </div>
                <div className={pageStyles.libBody}>
                    <div className={pageStyles.libCard}>
                        <Monitor size={20}/>
                        全部频道1
                    </div>
                    <div className={pageStyles.libCard}>
                        <Monitor size={20}/>
                        全部频道2
                    </div>
                    <div className={pageStyles.libCard}>
                        <Cloud size={20}/>
                        全部频道3
                    </div>
                </div>
            </div>
            <div className={pageStyles.libGrid}>
                <div className={pageStyles.libHeader}>
                    <a className={pageStyles.libLink}>全部文件</a>
                    <a href={`/${lang}/community/articles`} className={pageStyles.libLink}>全部文件</a>
                </div>
                <div className={pageStyles.libBody}>
                    <div className={pageStyles.libCard}>
                        <Monitor size={20}/>
                        全部文件1
                    </div>
                    <div className={pageStyles.libCard}>
                        <Monitor size={20}/>
                        全部文件2
                    </div>
                    <div className={pageStyles.libCard}>
                        <Cloud size={20}/>
                        全部文件3
                    </div>
                </div>
            </div>
            <div className={pageStyles.libGrid}>
                <div className={pageStyles.libHeader}>
                    <a className={pageStyles.libLink}>全部图片</a>
                    <a href={`/${lang}/community/images`} className={pageStyles.libLink}>全部图片</a>
                </div>
                <div className={pageStyles.libBody}>
                    <div className={pageStyles.libCard}>
                        <Monitor size={20}/>
                        全部图片1
                    </div>
                    <div className={pageStyles.libCard}>
                        <Monitor size={20}/>
                        全部图片2
                    </div>
                </div>
            </div>
        </div>
    </ConsoleLayout>
}


