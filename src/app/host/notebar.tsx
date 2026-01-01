'use client'

import React, {useEffect, useState} from 'react'
import {libraryAtom, noteAtom, notebookAtom} from './providers/notebook'
import './notebar.scss'
import {PLSelectResult} from "@pnnh/atom";
import {useAtom, useAtomValue} from "jotai";
import {clientSigninDomain} from "./services/client/domain";
import {PSArticleModel} from "@/components/common/models/article";

export function ConsoleNotebar() {
    const [notesResult, setNotesResult] = useState<PLSelectResult<PSArticleModel>>()
    const libraryState = useAtomValue(libraryAtom)
    const notebookState = useAtomValue(notebookAtom)
    useEffect(() => {
        if (!libraryState || !libraryState.current || !libraryState.current.uid || !notebookState ||
            !notebookState.current || !notebookState.current.uid) {
            return
        }
        const currentUrn = notebookState.current.uid
        clientSigninDomain().then(async (domain) => {
            const selectResult = await domain.selectNotes(currentUrn, currentUrn, '')
            setNotesResult(selectResult)
        })
    }, [notebookState])

    if (!notesResult || !notesResult.data.range || notesResult.data.range.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={'noteList'}>
        {
            notesResult.data.range.map(item => {
                return <NoteCard key={item.uid} item={item}/>
            })
        }
    </div>
}

function NoteCard({item}: { item: PSArticleModel }) {
    const [note, setNote] = useAtom(noteAtom)

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
