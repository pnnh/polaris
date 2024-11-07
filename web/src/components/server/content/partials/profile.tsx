import React, {CSSProperties} from "react";
import styles from './profile.module.css'
import Link from "next/link";
import {getPathname} from "@/services/server/pathname";

export async function UserProfileSelector() {
    const pathname = await getPathname()

    const siteLinks = [
        {name: '加利资源', href: `/`},
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
        {name: '笔记', href: `/content/articles`},
        {name: '图片', href: `/content/pictures`},
        {name: '文件', href: `/content/files`},
        {name: '工具', href: `/content/tools`},
        {name: '关于', href: `/about`},
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
