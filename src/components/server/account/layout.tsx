import React from 'react'
import styles from './layout.module.scss'
import {PageMetadata} from "@/utils/page";


export default async function AccountLayout({
                                                children,
                                                pathname,
                                                searchParams,
                                                metadata,
                                                lang
                                            }: {
    children: React.ReactNode,
    pathname: string,
    searchParams: Record<string, string>,
    metadata: PageMetadata,
    lang: string
}) {
    return <div className={styles.accountLayout}>
        {children}
    </div>
}
