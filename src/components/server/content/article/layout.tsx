import React from 'react'
import {ContentPublicNavbar} from "@/components/server/content/partials/navbar";
import styles from './layout.module.scss'
import {Metadata} from "next";

export const templateBodyId = 'globalTemplateBody'

export default async function ArticleReadLayout({
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
    return <div className={styles.templateContainer}>
        <div>
            <ContentPublicNavbar pathname={pathname} searchParams={searchParams} lang={lang}/>
        </div>
        <div id={templateBodyId} className={styles.templateBody}>
            <div className={styles.bodyContainer}>
                {children}
            </div>
        </div>
    </div>
}
