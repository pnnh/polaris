import Link from 'next/link'
import './navbar.scss'
import Image from 'next/image'
import React, {CSSProperties} from "react";
import {UserProfileSelector} from "@/components/server/content/partials/profile";
import {loadSessions2} from "@/services/auth";
import {ContentSearchAction} from "@/components/client/content/search";
import {SessionModel} from "@/models/common/session";

export async function ContentPublicNavbar({pathname, searchParams, lang}: {
    pathname: string,
    searchParams: Record<string, string>,
    lang: string
}) {
    const activeClass = (item: string) => {
        return lang === item ? 'active' : ''
    }
    const sessionList: SessionModel[] = []
    return <div className={'navHeader'}>
        <div className={'leftNav'}>
            <div>
                <Link className={'brandLink'} href={'/'}>
                    <Image src='/images/logo.png' alt='logo' fill={true} sizes={'48px,48px'}/>
                </Link>
            </div>
            <UserProfileSelector/>
        </div>
        <div className={'rightNav'}>
            <div className={'languages'}>
                <a href={`/en`} className={activeClass('en')}>English</a>
                <a href={`/zh`} className={activeClass('zh')}>中文</a>
            </div>
            <ContentSearchAction pathname={pathname} queryKeyword={searchParams.keyword}/>
            <UserAction sessionList={sessionList}/>
        </div>
    </div>
}


async function UserAction({sessionList}: { sessionList: SessionModel[] }) {
    const clientAuthUrl = '/' // fullAuthUrl('/')
    const viewer = '' // 代表当前浏览的用户或目录
    return <>
        {
            // sessionList.map((session) => {
            //     const viewerString = stringToBase58(`${session.name}@${session.domain}`)
            //     let style: CSSProperties = {}
            //     if (viewerString === viewer) {
            //         style = {
            //             borderWidth: 2,
            //             borderColor: '#4A95DD',
            //         }
            //     }
            //     const linkUrl = '/' // `/content/${viewerString}/channels`
            //     if (!session.account.urn) {
            //         return <></>
            //     }
            //     return <Link className={'loginLink'} key={session.account.urn} href={linkUrl}>
            //         <PSImageServer src={session.account.image} style={style} alt={session.account.nickname} height={32}
            //                        width={32}/>
            //     </Link>
            //})
        }
        <Link
            href={clientAuthUrl} rel='nofollow' className={'plusLink'}>
            <Image src='/icons/navbar/plus.svg' alt='login' height={32} width={32}/>
        </Link>
    </>
}
