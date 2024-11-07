import React from 'react'
import './page.scss'
import {ConsoleLayout} from "@/components/server/console/layout";
import {NotebookBar} from '@/components/client/console/sidebar';
import {ConsoleNotebar} from "@/components/client/console/notebar";
import {ArticleEditorArea} from "@/components/client/console/partials/viewer";

export default async function Page() {
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
