import React from 'react'
import {PublicNavbar} from "@/app/partials/navbar";
import './layout.scss'

export const templateBodyId = 'globalTemplateBody'

export default async function ContentLayout({
                                                children,
                                                pathname,
                                                searchParams
                                            }: {
    children: React.ReactNode,
    pathname: string,
    searchParams: Record<string, string>
}) {
    return <div className={'templateContainer'}>
        <div className={'templateNavbar'}>
            <PublicNavbar pathname={pathname} searchParams={searchParams}/>
        </div>
        <div id={templateBodyId} className={'templateBody'}>
            <div className={'bodyContainer'}>
                {children}
            </div>
        </div>
    </div>
}
