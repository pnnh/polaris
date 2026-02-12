import {css} from "@/gen/styled/css";
import Image from 'next/image'
import React from "react";
import {SiteNavMenu} from "@/components/server/content/partials/profile";
import {UserAction} from "@/components/server/content/partials/userinfo";
import {PSLanguageSelector} from "./language";
import MenuIcon from '@mui/icons-material/Menu';
import {ThemeSwitch} from "@/components/server/content/partials/theme";
import {getServerTheme} from "@/components/server/theme";
import {AccountModel} from "@/components/common/models/account/account";
import {getSearchString} from "@/components/server/pathname";
import {ContentSearchAction} from "@/components/client/content/search";

const styles = {
    navHeader: css`
        display: flex;
        flex-direction: row;
        height: 3rem;
        justify-content: space-between;
        align-items: center;
        font-size: 1rem;
        font-weight: 400;
        color: var(--text-primary-color);
        @media screen and (min-width: 120rem) {
            width: 120rem;
            margin: 0 auto;
        }
    `,
    leftNav: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-left: 1rem;
        gap: 1rem;
    `,
    brandLink: css`
        color: var(--text-primary-color);
        text-decoration: none;
        font-size: 1rem;
        display: inline-block;
        position: relative;
        height: 2.2rem;
        width: 2.2rem;
    `,
    rightNav: css`
        margin-right: 2rem;
        display: none;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.9rem;
        @media screen and (min-width: 48rem) {
            display: flex;
            margin-right: 1rem;
        }
    `,
    toolsLink: css`
        text-decoration: none;
        color: var(--text-primary-color);
        cursor: pointer;
        display: inline-block;
        height: 1.5rem;
        width: 1.5rem;

        & svg {
            width: 100%;
            height: 100%;
        }
    `,
    languages: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        margin-right: 0.5rem;

        & a {
            text-decoration: none;
            color: var(--text-primary-color);
            font-size: 0.9rem;

            &.active {
                color: dodgerblue;
            }
        }
    `,
    rightNavMobile: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        margin-right: 1rem;
        @media screen and (min-width: 48rem) {
            display: none;
        }
    `,
    mobileMenu: css`
        display: inline-block;
        height: 1.8rem;
        width: 1.8rem;

        & svg {
            width: 100%;
            height: 100%;
        }
    `,
};

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
            <ContentSearchAction pathname={pathname} queryKeyword={searchParams.keyword} lang={lang}/>
            <ThemeSwitch lang={lang} themeName={themeName}/>
            <PSLanguageSelector lang={lang} currentUrl={currentUrl}/>
            <UserAction lang={lang} userInfo={userInfo}/>
            {/*<a className={styles.toolsLink} href={`/${lang}/tools`}><AppsIcon/></a>*/}
        </div>
        <div className={styles.rightNavMobile}>
            {/*<PSLanguageSelector lang={lang} currentUrl={currentUrl}/>*/}
            <a className={styles.mobileMenu} href={`${lang}`}><MenuIcon/></a>
        </div>
    </div>
}
