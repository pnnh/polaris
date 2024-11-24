import React from 'react'
import {LibrarySelector} from "@/console/partials/library";
import {NotebookList} from "@/console/partials/notebook";
import './sidebar.scss'

export function NotebookBar() {
    return <div className={'stylesSidebar'}>
        <LibrarySelector></LibrarySelector>
        <NotebookList/>
    </div>
}
