import React, {CSSProperties} from "react";
import styles from './profile.module.css'
import Link from "next/link";
import {getPathname} from "@/services/server/pathname";

export function UserProfileSelector() {
    const pathname = getPathname()

    const siteLinks = [
        {name: '哈宝笔记', href: `/`},
    ]

    return <>
        <div className={styles.roleButtonContainer}>
            {
                siteLinks.map((link) => {
                    let style: CSSProperties = {}
                    if (pathname === link.href) {
                        style = {
                            color: '#4A95DD',
                        }
                    }
                    return <Link key={link.name} className={styles.siteLink} style={style} href={link
                        .href}>{link.name}</Link>
                })
            }
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#C6C6C6">
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z"/>
        </svg>
        <ArticleNavbar pathname={pathname}/>
    </>
}

function ArticleNavbar({pathname}: { pathname: string }) {
    const navLinks = [
        {name: '频道', href: `/content/channels`},
        // {name: '分类', href: `/content/categories`},
        // {name: '标签', href: `/content/tags`},
        // {name: '留言', href: `/content/comments`},
        // {name: '关于', href: `/content/about`},
    ]
    return <>
        {navLinks.map((link) => {
            let style: CSSProperties = {}
            if (pathname.startsWith(link.href)) {
                style = {
                    color: '#4A95DD',
                }
            }
            return <Link key={link.name} className={styles.navLink} style={style} href={link.href}>{link.name}</Link>
        })}
    </>
}
