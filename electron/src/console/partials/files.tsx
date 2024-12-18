import React from 'react'
import {useEffect, useState} from 'react'
import {useRecoilState, useRecoilValue} from 'recoil'
import {PSFileModel, PSNotebookModel} from '@pnnh/polaris-business'
import './files.scss'
import {filesAtom, libraryAtom, libraryListAtom, noteAtom} from "@/console/providers/notebook";

export function FileList() {
    const libraryState = useRecoilValue(libraryAtom)
    const [filesState, setFilesState] = useRecoilState(filesAtom)
    useEffect(() => {
        if (!libraryState.current) {
            return
        }
        window.serverAPI.selectFiles(libraryState.current.Path).then(selectResult => {
            setFilesState({
                models: selectResult.data.range
            })
        })
    }, [libraryState])

    if (!filesState || !filesState.models || filesState.models.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={'notebookContainer'}>
        <div className={'notebookList'}>
            {
                filesState.models.map(item => {
                    return <FileCard key={item.URN} item={item}/>
                })
            }
        </div>
    </div>
}

function FileCard({item}: { item: PSFileModel }) {
    const [noteState, setNoteState] = useRecoilState(noteAtom)
    return <div>
        <div className={'directorySelf'} onClick={() => {
            setNoteState({
                current: item
            })
        }}>
            <div className={'directoryName'}>
                {item.Name}</div>
        </div>
    </div>
}
