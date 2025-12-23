import React from 'react'
import {css} from '@emotion/css';
import {PageMetadata} from "@/components/common/utils/page";

const styles = {
    accountLayout: css`
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
        gap: 0;
        justify-items: center;
        align-items: center;
    `
};

export async function AccountLayout({
                                        children,
                                        metadata,
                                        lang
                                    }: {
    children: React.ReactNode,
    metadata: PageMetadata,
    lang: string
}) {
    return <div className={styles.accountLayout}>
        {children}
    </div>
}
