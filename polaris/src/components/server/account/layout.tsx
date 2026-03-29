import React from 'react'
import {css} from "@/gen/styled/css";


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
                                                lang
                                            }: {
    children: React.ReactNode,
    pathname: string,
    searchParams: Record<string, string>,
    lang: string
}) {
    return <div className={styles.accountLayout}>
        {children}
    </div>
}
