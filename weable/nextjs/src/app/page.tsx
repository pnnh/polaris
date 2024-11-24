import React from 'react'
import styles from './page.module.scss'
import {PublicNavbar} from './partials/navbar'
import Image from 'next/image'

export default async function Home() {
    return <div className={styles.fullPage}>
        <div>
            <PublicNavbar viewer={''}/>
        </div>
        <div className={styles.mainContainer}>
            <div className={styles.contentCenter}>
                <Image src={'/images/bear.jpg'} width={888} height={888} alt='lighthouse'/>
            </div>
        </div>
    </div>
}
