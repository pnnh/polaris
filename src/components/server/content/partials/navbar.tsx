import styles from './navbar.module.scss'
import Image from 'next/image'
import React, {CSSProperties} from "react";
import {UserProfileSelector} from "@/components/server/content/partials/profile";
import {UserAction} from "@/components/server/content/partials/userinfo";
import {ContentSearchAction} from "@/components/server/content/partials/search";
import {useServerConfig} from "@/services/server/config";
import {AccountModel} from "@/atom/common/models/account";
import AppsIcon from '@mui/icons-material/Apps';
import {PSLanguageSelector} from "@/components/common/language";
import {getPathname, getSearchString} from "@/services/server/pathname";

export async function ContentPublicNavbar({pathname, searchParams, lang, userInfo}: {
    pathname: string,
    searchParams: Record<string, string>,
    lang: string,
    userInfo: AccountModel
}) {
    const serverConfig = useServerConfig()

    const searchString = await getSearchString()
    const currentUrl = `${pathname}${searchString}`

    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <div>
                <a className={styles.brandLink} href={'/'}>
                    <Image src='/images/logo.png' alt='logo' priority={false} fill={true} sizes={'48px,48px'}/>
                </a>
            </div>
            <UserProfileSelector lang={lang} searchParams={searchParams}/>
        </div>
        <div className={styles.rightNav}>
            {/*<div className={'languages'}>*/}
            {/*    <a href={`/en`} className={activeClass('en')}>English</a>*/}
            {/*    <a href={`/zh`} className={activeClass('zh')}>中文</a>*/}
            {/*</div>*/}
            <PSLanguageSelector lang={lang} currentUrl={currentUrl}/>
            <ContentSearchAction pathname={pathname} queryKeyword={searchParams.keyword}/>
            <a className={styles.toolsLink} href={'/tools'}><AppsIcon/></a>
            <UserAction lang={lang} portalUrl={serverConfig.PUBLIC_PORTAL_URL} userInfo={userInfo}/>
        </div>
    </div>
}


