import Link from 'next/link'
import styles from './navbar.module.scss'
import Image from 'next/image'
import React, {CSSProperties} from "react";
import {UserProfileSelector} from "@/app/partials/profile";

export async function PublicNavbar({viewer}: { viewer: string }) {
    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <div>
                <Link className={styles.brandLink} href={'/'}>
                    <Image src='/images/logo.svg' alt='logo' fill={true} sizes={'40px,40px'}/>
                </Link>
            </div>
            <UserProfileSelector viewer={viewer}/>
        </div>
        <div className={styles.rightNav}>
            <UserAction/>
        </div>
    </div>
}


async function UserAction() {
    const clientAuthUrl = '/' //fullAuthUrl('/')
    return <>
        <Link
            href={clientAuthUrl} rel='nofollow' className={styles.plusLink}>
            <Image src='/icons/navbar/plus.svg' alt='login' height={32} width={32}/>
        </Link>
    </>
}
