import {NotebookBar} from './sidebar'
import React from 'react'
import {ConsoleLayout} from "@/console/layout";
import './page.scss'
import {FileListContainer} from "@/console/partials/files";

export function ConsolePage() {
    return (
        <ConsoleLayout>
            <div className={'directoryBar'}>
                <NotebookBar></NotebookBar>
            </div>
            <div className={'notesContainer'}>
                <div className={'notebarContainer'}>
                    <FileListContainer></FileListContainer>
                </div>
            </div>
        </ConsoleLayout>
    )
}
