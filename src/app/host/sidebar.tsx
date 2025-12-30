import React from 'react'
import {LibrarySelector} from "./partials/library";
import {NotebookList} from "./partials/notebook";
import './sidebar.scss'

export function NotebookBar() {
    return <div className={'stylesSidebar'}>
        <LibrarySelector></LibrarySelector>
        <NotebookList/>
    </div>
}
