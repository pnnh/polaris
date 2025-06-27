'use client'

import styles from './navbar.module.scss'
import {AccountModel} from "@/atom/common/models/account";

export function AdminNavbar(props: { account?: AccountModel }) {
    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <a className={styles.brandLink} href='/'>POLARIS</a>
        </div>
        <div className={styles.rightNav}>
            <div>{props.account?.nickname}</div>
        </div>
    </div>
}
