import React, {CSSProperties} from "react";
import './profile.scss'
import Link from "next/link";
import {getPathname} from "@/services/server/pathname";

export async function UserProfileSelector() {
    const pathname = await getPathname()

    const siteLinks = [
        {name: '加利社区', href: `/`},
    ]

    return <>
        <div className={'roleButtonContainer'}>
            {
                siteLinks.map((link) => {
                    let style: CSSProperties = {}
                    if (pathname === link.href) {
                        style = {
                            color: '#4A95DD',
                        }
                    }
                    return <Link key={link.name} className={'siteLink'} style={style} href={link
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
        {name: '文件', href: `/content/files`},
        {name: '工具', href: `/tools`},
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
            return <Link key={link.name} className={'navLink'} style={style} href={link.href}>{link.name}</Link>
        })}
    </>
}