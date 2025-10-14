import styles from './navbar.module.scss'
import Image from 'next/image'
import React, {CSSProperties} from "react";
import {SiteNavMenu} from "@/components/server/content/partials/profile";
import {UserAction} from "@/components/server/content/partials/userinfo";
import {ContentSearchAction} from "@/components/server/content/partials/search";
import {useServerConfig} from "@/services/server/config";
import {AccountModel} from "@/atom/common/models/account";
import AppsIcon from '@mui/icons-material/Apps';
import {PSLanguageSelector} from "./language";
import {getPathname, getSearchString} from "@/services/server/pathname";
import MenuIcon from '@mui/icons-material/Menu';
import {ThemeSwitch} from "@/components/server/content/partials/theme";
import {getServerTheme} from "@/services/server/theme";

export async function ContentPublicNavbar({pathname, searchParams, lang, userInfo, pandoraUrl}: {
    pathname: string,
    searchParams: Record<string, string>,
    lang: string,
    userInfo: AccountModel | undefined,
    pandoraUrl: string
}) {
    const serverConfig = await useServerConfig()

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
            <ContentSearchAction pathname={pathname} queryKeyword={searchParams.keyword} lang={lang}/>
            <ThemeSwitch lang={lang} themeName={themeName}/>
            <PSLanguageSelector lang={lang} currentUrl={currentUrl}/>
            <UserAction lang={lang} portalUrl={serverConfig.PUBLIC_PORTAL_URL}
                        userInfo={userInfo}/>
            <a className={styles.toolsLink} href={pandoraUrl}><AppsIcon/></a>
        </div>
        <div className={styles.rightNavMobile}>
            <PSLanguageSelector lang={lang} currentUrl={currentUrl}/>
            <a className={styles.mobileMenu} href={`${lang}`}><MenuIcon/></a>
        </div>
    </div>
}


