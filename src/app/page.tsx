import React from 'react'
import styles from './page.module.scss'
import ContentLayout from '@/components/server/content/layout'
import {getPathname} from "@/services/server/pathname";
import {Metadata} from 'next'
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Page({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams
    const metadata: Metadata = {
        title: '',
        keywords: 'tools,notes,工具,笔记',
        description: '',
    }
    return <ContentLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={styles.homeContainer}>
            <div className={styles.contentList}>
                <ChannelItem lang={'zh'}/>
                <ArticleItem lang={'zh'}/>
                <PasswordItem lang={'zh'}/>
                <UuidItem lang={'zh'}/>
                <QrcodeItem lang={'zh'}/>
            </div>
        </div>
    </ContentLayout>
}


function ChannelItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/channels'}>频道列表</Link>
            </div>
            <div className={styles.itemDescription}>
                频道列表
            </div>
        </div>
    </div>
}

function ArticleItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/channels'}>文章列表</Link>
            </div>
            <div className={styles.itemDescription}>
                频道列表
            </div>
        </div>
    </div>
}

function PasswordItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/channels'}>随机密码生成器</Link>
            </div>
            <div className={styles.itemDescription}>
                频道列表
            </div>
        </div>
    </div>
}

function UuidItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/channels'}>UUID生成器</Link>
            </div>
            <div className={styles.itemDescription}>
                频道列表
            </div>
        </div>
    </div>
}

function QrcodeItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/channels'}>二维码生成器</Link>
            </div>
            <div className={styles.itemDescription}>
                频道列表
            </div>
        </div>
    </div>
}
