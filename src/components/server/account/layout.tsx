import React from 'react'
import {Metadata} from "next";
import styles from './layout.module.scss'


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
    metadata: Metadata,
    lang: string
}) {
    return <div className={styles.accountLayout}>
        {children}
    </div>
}
