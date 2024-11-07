'use client'

import {useEffect, useState} from 'react'
import {useRecoilValue, useSetRecoilState} from 'recoil'
import React from 'react'
import './notebar.scss'
import {libraryAtom, noteAtom, notebookAtom} from "@/services/client/console/providers/notebook";
import {PSNoteModel} from "@/models/common/personal/note";
import {PLSelectResult} from "@/models/common/common-result";

export function ConsoleNotebar() {
    const [notesResult, setNotesResult] = useState<PLSelectResult<PSNoteModel>>()
    const libraryState = useRecoilValue(libraryAtom)
    const notebookState = useRecoilValue(notebookAtom)
    useEffect(() => {
        if (!libraryState || !libraryState.current || !libraryState.current.urn || !notebookState ||
            !notebookState.current || !notebookState.current.urn) {
            return
        }
        // selectNotes(libraryState.current.urn, notebookState.current.urn).then(selectResult => {
        //     setNotesResult(selectResult)
        // })
    }, [notebookState])

    if (!notesResult || !notesResult.range || notesResult.range.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={'noteList'}>
        {
            notesResult.range.map(item => {
                return <NoteCard key={item.urn} item={item}/>
            })
        }
    </div>
}

function NoteCard({item}: { item: PSNoteModel }) {
    const setNote = useSetRecoilState(noteAtom)

    return <div className={'noteCard'} onClick={() => {
        setNote({
            current: item
        })
    }}>
        <div className={'noteSelf'}>
            <div className={'noteName'}>
                {item.title}</div>
        </div>
    </div>
}
