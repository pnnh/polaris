'use client'

import styles from './navbar.module.scss'
import Link from 'next/link'
import {AccountModel} from "@/models/account";

export function ConsoleNavbar(props: { account?: AccountModel }) {
    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <Link className={styles.brandLink} href='/'>POLARIS</Link>
        </div>
        <div className={styles.rightNav}>
            <div>{props.account?.nickname}</div>
        </div>
    </div>
}
