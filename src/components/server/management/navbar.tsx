import {css} from "@/gen/styled/css";
import Image from 'next/image'
import React from "react";
import {UserActionDropdown} from "@/components/client/userActionDropdown";
import {PSLanguageSelector} from "@/components/server/content/partials/language";
import {ThemeSwitch} from "@/components/server/content/partials/theme";
import {getServerTheme} from "@/components/server/theme";
import {AccountModel} from "@/components/common/models/account/account";
import {getSearchString} from "@/components/server/pathname";

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
    communityTitle: css`
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--text-primary-color);
    `,
    rightNav: css`
        margin-right: 1rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 0.9rem;
    `,
};

export async function ManagementNavbar({pathname, searchParams, lang, userInfo}: {
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
            <div className={styles.communityTitle}>控制台</div>
        </div>
        <div className={styles.rightNav}>
            <ThemeSwitch lang={lang} themeName={themeName}/>
            <PSLanguageSelector lang={lang} currentUrl={currentUrl}/>
            <UserActionDropdown lang={lang} userInfo={userInfo}/>
        </div>
    </div>
}
