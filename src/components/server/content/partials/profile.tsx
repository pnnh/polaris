import React, {CSSProperties} from "react";
import './profile.scss'
import Link from "next/link";
import {getPathname} from "@/services/server/pathname";

export async function UserProfileSelector({searchParams}: { searchParams: Record<string, string> }) {
    const pathname = await getPathname()

    const siteLinks = [
        {name: '希波万象', href: `/`},
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
        {pathname.startsWith('/articles') && <ArticleSubNavbar pathname={pathname} searchParams={searchParams}/>}
    </>
}

function ArticleNavbar({pathname}: { pathname: string }) {
    const navLinks = [
        {name: '频道', href: `/channels`},
        {name: '笔记', href: `/articles`},
        {name: '随机密码', href: `/tools/password`},
        {name: 'UUID', href: `/tools/uuid`},
        {name: '二维码', href: `/tools/qrcode`},
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

function ArticleSubNavbar({pathname, searchParams}: { pathname: string, searchParams: Record<string, string> }) {
    const navLinks = [
        {name: '手书笔记', href: `/articles/dir1`},
        {name: '源码笔记', href: `/articles/dir2`},
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
            return <Link key={link.name} className={'navLink'} style={style} href={link.href}>{link.name}</Link>
        })}
    </>
}
