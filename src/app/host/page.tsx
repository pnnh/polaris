import React from 'react'
import {headers} from "next/headers";
import {langEnUS} from "@/components/common/language";
import {NotebookBar} from './sidebar'
import {ConsoleNotebar} from './notebar'
import {ArticleEditorArea} from "./partials/viewer";
import {notFound} from "next/navigation";

export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    const headersList = await headers()
    const acceptLang = headersList.get('Accept-Language') || langEnUS
    const searchParamsValue = await searchParams
    if (!searchParamsValue.todoHostKey) {
        notFound()  // TODO 改成无法访问提示
    }

    return <>
        <div className={'directoryBar'}>
            <NotebookBar></NotebookBar>
        </div>
        <div className={'notesContainer'}>
            <div className={'notebarContainer'}>
                <ConsoleNotebar></ConsoleNotebar>
            </div>
            <div className={'noteViewer'}>
                <ArticleEditorArea></ArticleEditorArea>
            </div>
        </div>
    </>
}


