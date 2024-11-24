import React, {CSSProperties} from "react";
import styles from './profile.module.css'
import Link from "next/link";
import {userRole} from "@/services/schema";
import {getPathname} from "@/services/server/pathname";

export function UserProfileSelector({viewer}: { viewer: string }) {
    const entry = userRole()
    const pathname = getPathname()

    const siteLinks = [
        {name: '图片', href: `/content/channels`},
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
        <ArticleNavbar viewer={viewer} role={entry} pathname={pathname}/>
    </>
}

function ArticleNavbar({viewer, role, pathname}: { viewer: string, role: string, pathname: string }) {
    const navLinks = [
        {name: '频道', href: `/content/channels`},
    ]
    return <>
        {navLinks.map((link) => {
            let style: CSSProperties = {}
            if (pathname === link.href) {
                style = {
                    color: '#4A95DD',
                }
            }
            return <Link key={link.name} className={styles.navLink} style={style} href={link.href}>{link.name}</Link>
        })}
    </>
}
