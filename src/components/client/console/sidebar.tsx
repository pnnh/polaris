'use client'

import React from 'react'
import './sidebar.scss'
import {NotebookList} from './partials/notebook'

export function NotebookBar() {
    return <div className={'stylesSidebar'}>
        {/*<LibrarySelector></LibrarySelector>*/}
        <NotebookList/>
    </div>
}
