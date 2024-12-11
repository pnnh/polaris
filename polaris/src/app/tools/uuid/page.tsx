import React from 'react'
import {ToolBody} from "./tool";
import './page.scss'

export default async function Home({params, searchParams}: {
    params: { lang: string },
    searchParams: Record<string, string>
}) {
    return <div className={'fullPage'}>
        <div className={'pageContent'}>
            <ToolBody lang={params.lang}/>
        </div>
    </div>
}
