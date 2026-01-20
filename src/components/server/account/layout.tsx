import React from 'react'
import {css} from "@/gen/styled/css";
import {PageMetadata} from "@/components/common/utils/page";
import GlobalLayout from "@/components/server/global";

const styles = {
    accountLayout: css`
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
        gap: 0;
        justify-items: center;
        align-items: center;
    `,
};

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
    return <GlobalLayout lang={lang} metadata={metadata}>
        <div className={styles.accountLayout}>
            {children}
        </div>
    </GlobalLayout>
}
