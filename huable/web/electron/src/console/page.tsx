import {NotebookBar} from './sidebar'
import {ConsoleNotebar} from './notebar'
import React from 'react'
import {ConsoleLayout} from "@/console/layout";
import './page.scss'
import {ArticleEditorArea} from "@/console/partials/viewer";

export function ConsolePage() {
    return (
        <ConsoleLayout>
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
        </ConsoleLayout>
    )
}
