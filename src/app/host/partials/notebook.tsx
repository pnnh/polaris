'use client'
import React, {useEffect} from 'react'
import './notebook.scss'
import {useAtom, useAtomValue} from "jotai";
import {libraryAtom, notebookAtom} from "@/app/host/providers/notebook";
import {clientSigninDomain} from "@/app/host/services/client/domain";
import {PSNotebookModel} from "@/components/common/models/personal/notebook";

export function NotebookList() {
    const libraryState = useAtomValue(libraryAtom)
    const [notebookState, setNotebookState] = useAtom(notebookAtom)
    useEffect(() => {
        if (!libraryState.current || !libraryState.current.uid) {
            return
        }
        const uid = libraryState.current.uid
        clientSigninDomain().then(async domain => {
            const selectResult = await domain.selectNotebooks(uid, '')
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
                    return <NotebookCard key={item.uid} item={item}/>
                })
            }
        </div>
        <div className={'newNotebook'}>新增笔记本</div>
    </div>
}

function NotebookCard({item}: { item: PSNotebookModel }) {
    const [notebookState, setNotebookState] = useAtom(notebookAtom)
    return <div>
        <div className={'directorySelf'} onClick={() => {
            setNotebookState({
                models: notebookState.models,
                current: item
            })
        }}>
            <div className={'directoryName'}>
                {item.name}</div>
        </div>
    </div>
}
