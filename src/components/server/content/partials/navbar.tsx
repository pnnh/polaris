import Link from 'next/link'
import './navbar.scss'
import Image from 'next/image'
import React, {CSSProperties} from "react";
import {UserProfileSelector} from "@/components/server/content/partials/profile";
import {UserAction} from "@/components/server/content/partials/userinfo";
import {ContentSearchAction} from "@/components/server/content/partials/search";
import {useServerConfig} from "@/services/server/config";

export async function ContentPublicNavbar({pathname, searchParams, lang}: {
    pathname: string,
    searchParams: Record<string, string>,
    lang: string
}) {
    const serverConfig = useServerConfig()
    return <div className={'navHeader'}>
        <div className={'leftNav'}>
            <div>
                <Link className={'brandLink'} href={'/'}>
                    <Image src='/images/logo.png' alt='logo' priority={false} fill={true} sizes={'48px,48px'}/>
                </Link>
            </div>
            <UserProfileSelector searchParams={searchParams}/>
        </div>
        <div className={'rightNav'}>
            {/*<div className={'languages'}>*/}
            {/*    <a href={`/en`} className={activeClass('en')}>English</a>*/}
            {/*    <a href={`/zh`} className={activeClass('zh')}>中文</a>*/}
            {/*</div>*/}
            <ContentSearchAction pathname={pathname} queryKeyword={searchParams.keyword}/>
            <UserAction portalUrl={serverConfig.PUBLIC_PORTAL_URL}/>
        </div>
    </div>
}


