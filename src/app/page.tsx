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
            <div className={styles.bannerContainer}>
                <img src={'/images/banner/banner.jpg'}/>
                <div className={styles.bannerFront}>
                    <div className={styles.bannerTitle}>
                        希波万象
                    </div>
                    <div className={styles.bannerDescription}>
                        天高地迥，觉宇宙之无穷。兴尽悲来，识盈虚之有数。
                    </div>
                </div>
            </div>
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
        <div className={styles.itemImage}>
            <img src={'/images/application/channel.webp'} alt={'channel'}/>
        </div>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/channels'}>频道列表</Link>
            </div>
            <div className={styles.itemDescription}>
                频道是一个在线分享通道，用户可以在上面分享笔记。每个频道都与一个独特的名称相关联，作为与读者互动并围绕他们分享的内容进行讨论的可定制空间。
            </div>
        </div>
    </div>
}

function ArticleItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemImage}>
            <img src={'/images/application/article.webp'} alt={'channel'}/>
        </div>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/articles'}>笔记列表</Link>
            </div>
            <div className={styles.itemDescription}>
                笔记是一种常用、多功能的工具，善用笔记，能够帮助我们更好的学习、工作、生活，取得更好的效益。
            </div>
        </div>
    </div>
}

function PasswordItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemImage}>
            <img src={'/images/application/password.webp'} alt={'channel'}/>
        </div>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/tools/password'}>随机密码生成器</Link>
            </div>
            <div className={styles.itemDescription}>
                强密码具有唯一性和随机性。满足其中一种特性的密码都不易想出，更不用说同时满足两种特性的密码了。用于创建安全、复杂的密码，包括结合大小写字母、数字和特殊字符的密码。
            </div>
        </div>
    </div>
}

function UuidItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemImage}>
            <img src={'/images/application/uuid.webp'} alt={'channel'}/>
        </div>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/tools/uuid'}>UUID生成器</Link>
            </div>
            <div className={styles.itemDescription}>
                UUID是通用唯一识别码的缩写，旨在一台机器上生成的唯一数字，由32位16进制数字组成，形式为8-4-4-4-12。由于UUID的唯一性特征，通常用于分布式系统中对象的标识。
            </div>
        </div>
    </div>
}

function QrcodeItem(props: { lang: string }) {

    return < div className={styles.contentItem}>
        <div className={styles.itemImage}>
            <img src={'/images/application/qrcode.webp'} alt={'channel'}/>
        </div>
        <div className={styles.itemDetail}>
            <div className={styles.itemTitle}>
                <Link className={'link'} href={'/tools/uuid'}>二维码生成器</Link>
            </div>
            <div className={styles.itemDescription}>
                一站式二维码生成工具，免费可用。提供编码解码、数据统计、富文本和多媒体展示、表单制作、美化标签、批量管理等功能，并可作为无代码平台，搭建二维码信息系统。
            </div>
        </div>
    </div>
}
