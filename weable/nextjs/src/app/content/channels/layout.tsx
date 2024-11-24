import React from 'react'
import styles from './layout.module.css'
import {PublicNavbar} from "@/app/partials/navbar";

export default async function ArticleLayout({
                                                children,
                                                params
                                            }: {
    params: { viewer: string },
    children: React.ReactNode
}) {
    return <div className={styles.container}>
        <div>
            <PublicNavbar viewer={params.viewer}/>
        </div>
        <div className={styles.body}>
            {children}
        </div>
    </div>
}
