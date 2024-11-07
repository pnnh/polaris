import React from 'react'
import {PublicNavbar} from "@/app/partials/navbar";
import './layout.scss'
import {HtmlLayout} from '../layout';
import {Metadata} from "next";

export const templateBodyId = 'globalTemplateBody'

export default async function ContentLayout({
                                                children,
                                                pathname,
                                                searchParams,
                                                metadata
                                            }: {
    children: React.ReactNode,
    pathname: string,
    searchParams: Record<string, string>,
    metadata: Metadata
}) {
    return (<HtmlLayout metadata={metadata}>
        <div className={'templateContainer'}>
            <div className={'templateNavbar'}>
                <PublicNavbar pathname={pathname} searchParams={searchParams}/>
            </div>
            <div id={templateBodyId} className={'templateBody'}>
                <div className={'bodyContainer'}>
                    {children}
                </div>
            </div>
        </div>
    </HtmlLayout>)
}
