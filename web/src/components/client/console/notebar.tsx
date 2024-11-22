'use client'

import {useEffect, useState} from 'react'
import React from 'react'
import './notebar.scss'
import {PSNoteModel} from "@/models/common/personal/note";
import {PLSelectResult} from "@/models/common/common-result";
import {filesMailbox} from "@/services/client/console/mailbox";
import {registerComponent, unregisterComponent} from "@/services/client/postoffice";
import {PSFileModel} from "@/models/common/filesystem";

export function ConsoleNotebar() {
    const [notesResult, setNotesResult] = useState<PLSelectResult<PSFileModel>>()
    // const libraryState = useRecoilValue(libraryAtom)
    // const notebookState = useRecoilValue(notebookAtom)
    // useEffect(() => {
    //     if (!libraryState || !libraryState.current || !libraryState.current.urn || !notebookState ||
    //         !notebookState.current || !notebookState.current.urn) {
    //         return
    //     }
    //     // selectNotes(libraryState.current.urn, notebookState.current.urn).then(selectResult => {
    //     //     setNotesResult(selectResult)
    //     // })
    // }, [notebookState])

    useEffect(() => {
        const stub = filesMailbox.subscribe<PLSelectResult<PSFileModel>>('abc', (mail) => {
            console.log('subscribe22', mail)
            setNotesResult(mail.content as PLSelectResult<PSFileModel>)
        })
        // registerComponent(filesMailbox)
        console.log('registerComponent')
        return () => {
            console.log('unregisterComponent')
            // unregisterComponent(filesMailbox)
            filesMailbox.unsubscribe(stub)
        }
    }, []);

    if (!notesResult || !notesResult.data || !notesResult.data.range || notesResult.data.range.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={'noteList'}>
        {
            notesResult.data.range.map(item => {
                return <NoteCard key={item.URN} item={item}/>
            })
        }
    </div>
}

function NoteCard({item}: { item: PSFileModel }) {
    // const setNote = useSetRecoilState(noteAtom)

    return <div className={'noteCard'} onClick={() => {
        // setNote({
        //     current: item
        // })
    }}>
        <div className={'noteSelf'}>
            <div className={'noteName'}>
                {item.Title}</div>
        </div>
    </div>
}
