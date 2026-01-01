import styles from './navbar.module.scss'
import Image from 'next/image'
import React from "react";
import {SiteNavMenu} from "@/components/server/content/partials/profile";
import {UserAction} from "@/components/server/content/partials/userinfo";
import {PSLanguageSelector} from "./language";
import {getSearchString} from "@/components/server/pathname";
import MenuIcon from '@mui/icons-material/Menu';
import {ThemeSwitch} from "@/components/server/content/partials/theme";
import {getServerTheme} from "@/components/server/theme";
import {AccountModel} from "@/components/common/models/account/account";

export async function ContentPublicNavbar({pathname, searchParams, lang, userInfo}: {
    pathname: string,
    searchParams: Record<string, string>,
    lang: string,
    userInfo: AccountModel | undefined
}) {
    const searchString = await getSearchString()
    const currentUrl = `${pathname}${searchString}`
    const themeName = await getServerTheme()

    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <a className={styles.brandLink} href={`/`}>
                <Image src='/images/logo.png' alt='logo' priority={false} fill={true} sizes={'48px,48px'}/>
            </a>
            <SiteNavMenu lang={lang} searchParams={searchParams}/>
        </div>
        <div className={styles.rightNav}>
            {/*<ContentSearchAction pathname={pathname} queryKeyword={searchParams.keyword} lang={lang}/>*/}
            <ThemeSwitch lang={lang} themeName={themeName}/>
            <PSLanguageSelector lang={lang} currentUrl={currentUrl}/>
            <UserAction lang={lang} userInfo={userInfo}/>
            {/*<a className={styles.toolsLink} href={`/${lang}/tools`}><AppsIcon/></a>*/}
        </div>
        <div className={styles.rightNavMobile}>
            <PSLanguageSelector lang={lang} currentUrl={currentUrl}/>
            <a className={styles.mobileMenu} href={`${lang}`}><MenuIcon/></a>
        </div>
    </div>
}
