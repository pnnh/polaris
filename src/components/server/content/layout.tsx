import React from 'react'
import {ContentPublicNavbar} from "@/components/server/content/partials/navbar";
import './layout.scss'
import {HtmlLayout} from '../layout';
import {Metadata} from "next";

export const templateBodyId = 'globalTemplateBody'

export default async function ContentLayout({
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
    return (<HtmlLayout metadata={metadata}>
        <div className={'templateContainer'}>
            <div className={'templateNavbar'}>
                <ContentPublicNavbar pathname={pathname} searchParams={searchParams} lang={lang}/>
            </div>
            <div id={templateBodyId} className={'templateBody'}>
                <div className={'bodyContainer'}>
                    {children}
                </div>
            </div>
        </div>
    </HtmlLayout>)
}
