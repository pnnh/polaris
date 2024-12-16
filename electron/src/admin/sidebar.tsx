'use client'

import Link from 'next/link'
import styles from './sidebar.module.scss'

export function ConsoleSidebar() {
    return <div className={styles.sidebar}>
        <div className={styles.sidebarItem}>
            <Link
                href="/admin"
            >
                管理首页
            </Link>
        </div>
        <div className={styles.sidebarItem}>
            <Link
                href="/admin/channels"
            >
                频道列表
            </Link>
        </div>
        <div className={styles.sidebarItem}>
            <Link
                href="/admin/articles"
            >
                文章列表
            </Link>
        </div>
    </div>
}
