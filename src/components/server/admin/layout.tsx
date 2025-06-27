import React from 'react'
import styles from './layout.module.scss'
import {AdminNavbar,} from "@/components/client/admin/navbar";
import {AdminSidebar} from "@/components/client/admin/sidebar";

export async function AdminLayout({
                                      children
                                  }: {
    children: React.ReactNode
}) {
    const identity = {account: ''}//await getIdentity()

    if (!identity) {
        const clientAuthUrl = '' //fullAuthUrl('/console')

        return <div>
            <h1>您尚未登陆或已过期</h1>
            <a
                href={clientAuthUrl}>前往登陆</a>
        </div>
    }
    return <div className={styles.childrenContainer}>
        <div className={styles.navbar}>
            <AdminNavbar account={undefined}></AdminNavbar>
        </div>
        <div className={styles.mainContainer}>
            <div className={styles.leftNav}><AdminSidebar></AdminSidebar></div>
            <div className={styles.rightBody}>
                {children}
            </div>
        </div>
    </div>
}
