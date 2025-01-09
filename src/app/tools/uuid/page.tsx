import React from 'react'
import {ToolBody} from "./tool";
import './page.scss'
import {getPathname} from "@/services/server/pathname";
import {Metadata} from "next";
import ContentLayout from "@/components/server/content/layout";
import {CommentsClient} from "@/components/client/comments/comments";

export default async function Home({params, searchParams}: {
    params: Promise<{ channel: string }>,
    searchParams: Promise<Record<string, string>>
}) {
    const pathname = await getPathname()
    const baseParams = await params;
    const searchParamsValue = await searchParams
    const metadata: Metadata = {
        title: 'codegen.seo.title',
        keywords: 'codegen.seo.keywords',
        description: 'codegen.seo.description',
    }
    return <ContentLayout lang={'zh'} searchParams={searchParamsValue} pathname={pathname}
                          metadata={metadata}>
        <div className={'uuidPage'}>
            <div className={'pageContent'}>
                <ToolBody lang={'zh'}/>
            </div>
            <div className={'commentsClient'}>
                <CommentsClient resource={'1efce644-be3b-6380-8e9f-473511aecbe1'}/>
            </div>
        </div>
    </ContentLayout>
}
