'use client'

import React from 'react'
import './notebook.scss'
import {PSNotebookModel} from "@/models/common/personal/notebook";

export function NotebookList() {
    return <div className={'notebookContainer'}>
        <div className={'notebookList'}>
            <div className={'functionLabel'}>资源管理器</div>
            <div className={'directoryBody'}>
                <div className={'directoryGroup'}>位置</div>
                <div className={'directoryList'}>
                    <div className={'directoryItem'}>根目录</div>
                    <div className={'directoryItem'}>主目录</div>
                </div>
            </div>
        </div>
    </div>
}

function NotebookCard({item}: { item: PSNotebookModel }) {
    // const [notebookState, setNotebookState] = useRecoilState(notebookAtom)
    return <div>
        <div className={'directorySelf'} onClick={() => {
            // setNotebookState({
            //     models: notebookState.models,
            //     current: item
            // })
        }}>
            <div className={'directoryName'}>
                {item.title}</div>
        </div>
    </div>
}
