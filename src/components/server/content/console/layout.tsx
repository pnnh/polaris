import React from 'react'
import styles from './layout.module.scss'
import {AccountModel} from "@/atom/common/models/account";
import {SymbolUnknown} from "@/atom/common/models/protocol";
import GlobalLayout from "@/components/server/global";
import {PageMetadata} from "@/utils/page";

export default async function ConsoleLayout({
                                                children,
                                                pathname,
                                                searchParams,
                                                metadata,
                                                lang,
                                                userInfo
                                            }: {
    children: React.ReactNode,
    pathname: string,
    searchParams: Record<string, string>,
    metadata: PageMetadata,
    lang: string,
    userInfo: AccountModel | typeof SymbolUnknown
}) {
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.consoleContainer}>
            {children}
        </div>
    </GlobalLayout>
}
