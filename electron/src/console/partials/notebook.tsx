import React from 'react'
import {useEffect, useState} from 'react'
import {useRecoilState, useRecoilValue} from 'recoil'
import {PSNotebookModel} from '@pnnh/polaris-business'
import {libraryAtom, notebookAtom} from "@/console/providers/notebook";
import './notebook.scss'

export function NotebookList() {
    const libraryState = useRecoilValue(libraryAtom)
    const [notebookState, setNotebookState] = useRecoilState(notebookAtom)
    useEffect(() => {
        if (!libraryState.current || !libraryState.current.urn) {
            return
        }
        window.serverAPI.selectNotebooks('', '').then(selectResult => {
            setNotebookState({
                models: selectResult.data.range,
                current: selectResult.data.range[0]
            })
        })
    }, [libraryState])

    if (!notebookState || !notebookState.models || notebookState.models.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={'notebookContainer'}>
        <div className={'notebookList'}>
            {
                notebookState.models.map(item => {
                    return <NotebookCard key={item.urn} item={item}/>
                })
            }
        </div>
        <div className={'newNotebook'}>新增笔记本</div>
    </div>
}

function NotebookCard({item}: { item: PSNotebookModel }) {
    const [notebookState, setNotebookState] = useRecoilState(notebookAtom)
    return <div>
        <div className={'directorySelf'} onClick={() => {
            setNotebookState({
                models: notebookState.models,
                current: item
            })
        }}>
            <div className={'directoryName'}>
                {item.title}</div>
        </div>
    </div>
}
