import React from 'react'
import styles from './layout.module.scss'
import {PageMetadata} from "@/utils/page";
import GlobalLayout from "@/components/server/global";

export default async function ToolsLayout({
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
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.toolsLayout}>
            {children}
        </div>
    </GlobalLayout>
}
