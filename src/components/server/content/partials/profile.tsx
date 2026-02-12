import React, {CSSProperties} from "react";
import {css} from "@/gen/styled/css";
import {transKey} from "@/components/common/locales/normal";
import {getPathname} from "@/components/server/pathname";
import {pageTitle} from "@/components/common/utils/page";

const styles = {
    siteNavMenu: css`
        display: none;
        @media screen and (min-width: 48rem) {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
        }
    `,
    selectorBox: css`
        border: solid 1px #e0e0e0;
        border-radius: 4px;
        background: #FFFFFF;
        display: flex;
        flex-direction: column;
        gap: 0;
    `,
    navLink: css`
        color: var(--text-primary-color);
        text-decoration: none;
        font-size: 0.95rem;
    `,
    navLinkInBox: css`
        color: var(--text-primary-color);
        padding: 8px 16px;
        text-decoration: none;
        font-size: 1rem;
        border-bottom: solid 1px #e0e0e0;

        &:last-child {
            border-width: 0;
        }
    `,
    roleButtonContainer: css`
        display: flex;
        flex-direction: row;
        gap: 8px;
        justify-content: center;
        align-items: center;
    `,
    siteLink: css`
        text-decoration: none;
        color: var(--text-primary-color);
        cursor: pointer;
        font-size: 1.1rem;
    `,
    toolsLink: css`
        text-decoration: none;
        color: #4e4e4e;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 400;
    `,
};

export async function SiteNavMenu({lang, searchParams}: {
    lang: string,
    searchParams: Record<string, string>
}) {
    const pathname = await getPathname()

    const siteLinks = [
        {name: pageTitle(lang), href: `/${lang}`},
    ]
    return <div className={styles.siteNavMenu}>
        <div className={styles.roleButtonContainer}>
            {
                siteLinks.map((link) => {
                    let style: CSSProperties = {}
                    if (pathname === link.href) {
                        style = {
                            color: '#4A95DD',
                        }
                    }
                    return <a key={link.name} className={styles.siteLink} style={style} href={link
                        .href}>{link.name}</a>
                })
            }
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#C6C6C6">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
        </svg>
        <ArticleNavbar pathname={pathname} lang={lang}/>
        {/*<ArticleSubNavbar lang={lang} pathname={pathname} searchParams={searchParams}/>*/}
    </div>
}

function ArticleNavbar({lang, pathname}: {
    lang: string, pathname: string
}) {
    const navLinks = [
        {name: transKey(lang, "navTools"), href: `/${lang}/tools`},
        {name: transKey(lang, "navArticles"), href: `/${lang}/articles`},
        {name: transKey(lang, "navChannels"), href: `/${lang}/channels`},
        {name: transKey(lang, "navImages"), href: `/${lang}/images`},
        // {name: '图片', href: `/images`},
        // {name: '随机密码', href: `/tools/password`},
        // {name: 'UUID', href: `/tools/uuid`},
        // {name: '二维码', href: `/tools/qrcode`},
    ]
    return <>
        {navLinks.map((link) => {
            let style: CSSProperties = {}
            if (pathname.startsWith(link.href)) {
                style = {
                    color: '#4A95DD',
                }
            }
            return <a key={link.name} className={styles.navLink} style={style} href={link.href}>{link.name}</a>
        })}
    </>
}

function ArticleSubNavbar({lang, pathname, searchParams}: {
    lang: string, pathname: string,
    searchParams: Record<string, string>
}) {
    const navLinks = [
        {name: transKey(lang, "handwrittenNotes"), href: `/articles/dir1`},
        {name: transKey(lang, "codeNotes"), href: `/articles/dir2`},
    ]
    let currentPathname = pathname
    if (currentPathname === '/articles') {
        currentPathname = navLinks[0].href
    }
    return <>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#C6C6C6">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
        </svg>
        {navLinks.map((link) => {
            let style: CSSProperties = {}
            if (currentPathname === link.href || currentPathname.startsWith(link.href)) {
                style = {
                    color: '#4A95DD',
                }
            }
            return <a key={link.name} className={styles.navLink} style={style} href={link.href}>{link.name}</a>
        })}
    </>
}
