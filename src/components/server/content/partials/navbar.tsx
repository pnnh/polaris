import styles from './navbar.module.scss'
import Image from 'next/image'
import React, {CSSProperties} from "react";
import {SiteNavMenu} from "@/components/server/content/partials/profile";
import {UserAction} from "@/components/server/content/partials/userinfo";
import {ContentSearchAction} from "@/components/server/content/partials/search";
import {useServerConfig} from "@/services/server/config";
import {AccountModel} from "@/atom/common/models/account";
import AppsIcon from '@mui/icons-material/Apps';
import {PSLanguageSelector} from "@/components/common/language";
import {getPathname, getSearchString} from "@/services/server/pathname";
import {ILanguageProvider} from "@/services/common/language";
import MenuIcon from '@mui/icons-material/Menu';

export async function ContentPublicNavbar({pathname, searchParams, langProvider, userInfo, pandoraUrl}: {
    pathname: string,
    searchParams: Record<string, string>,
    langProvider: ILanguageProvider,
    userInfo: AccountModel | undefined,
    pandoraUrl: string
}) {
    const serverConfig = await useServerConfig()

    const searchString = await getSearchString()
    const currentUrl = `${pathname}${searchString}`

    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <a className={styles.brandLink} href={`/${langProvider.lang}`}>
                <Image src='/images/logo.png' alt='logo' priority={false} fill={true} sizes={'48px,48px'}/>
            </a>
            <SiteNavMenu lang={langProvider.lang} langProvider={langProvider} searchParams={searchParams}/>
        </div>
        <div className={styles.rightNav}>
            <ContentSearchAction pathname={pathname} queryKeyword={searchParams.keyword} lang={langProvider.lang}/>
            <PSLanguageSelector lang={langProvider.lang} currentUrl={currentUrl}/>
            <UserAction lang={langProvider.lang} langProvider={langProvider} portalUrl={serverConfig.PUBLIC_PORTAL_URL}
                        userInfo={userInfo}/>
            <a className={styles.toolsLink} href={pandoraUrl}><AppsIcon/></a>
        </div>
        <div className={styles.rightNavMobile}>
            <PSLanguageSelector lang={langProvider.lang} currentUrl={currentUrl}/>
            <a className={styles.mobileMenu} href={`${langProvider.lang}`}><MenuIcon/></a>
        </div>
    </div>
}


