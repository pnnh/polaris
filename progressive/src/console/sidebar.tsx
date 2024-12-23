import React from 'react'
import {LibrarySelector} from "@/console/partials/library";
import './sidebar.scss'

export function NotebookBar() {
    return <div className={'stylesSidebar'}>
        <LibrarySelector></LibrarySelector>
    </div>
}
