'use client'

import React, {useEffect, useState} from 'react'
import './notebar.scss'
import {PLSelectResult} from "@/models/common/common-result";
import {filesMailbox} from "@/services/client/console/mailbox";
import {registerComponent, unregisterComponent} from "@/services/client/postoffice";
import {PSFileModel} from "@/models/common/filesystem";
import {clientMustSigninDomain} from "@/services/client/domain";
import {encodeBase64String} from "@/utils/basex";

export function ConsoleNotebar() {
    const [notesResult, setNotesResult] = useState<PLSelectResult<PSFileModel>>()
    useEffect(() => {
        const stub = filesMailbox.subscribe<PLSelectResult<PSFileModel>>('abc', (mail) => {
            console.log('subscribe22', mail)
            setNotesResult(mail.content as PLSelectResult<PSFileModel>)
        })
        console.log('registerComponent')
        return () => {
            console.log('unregisterComponent')
            filesMailbox.unsubscribe(stub)
        }
    }, []);

    if (!notesResult || !notesResult.data || !notesResult.data.range || notesResult.data.range.length <= 0) {
        return <div>Empty</div>
    }
    return <FileList level={0} selectResult={notesResult}/>
}

function FileList({level, selectResult}: { level: number, selectResult: PLSelectResult<PSFileModel> }) {
    if (!selectResult || !selectResult.data || !selectResult.data.range || selectResult.data.range.length <= 0) {
        return <div className={'noteList'}>
            <div>Empty</div>
        </div>
    }
    return <div className={'noteList'}>
        {
            selectResult.data.range.filter((item) => !item.IsHidden).map(item => {
                return <NoteCard key={item.URN} level={level + 1} item={item}/>
            })
        }
    </div>
}

async function loadFiles(path: string) {
    console.log('loadFiles', path)
    const domain = clientMustSigninDomain()
    const urlParam = encodeBase64String(path)
    const rankUrl = `/restful/files?url=${urlParam}`
    return await domain.makeGet<PLSelectResult<PSFileModel>>(rankUrl)
}

function NoteCard({level, item}: { level: number, item: PSFileModel }) {
    const [open, setOpen] = useState(false)
    const [notesResult, setNotesResult] = useState<PLSelectResult<PSFileModel>>()

    return <div className={'noteCard'}>
        <div className={'noteSelf'} style={{paddingLeft: `${level * 8}px`}}>
            <div className={'openIcon'}>
                {item.IsDir && <img src={'/icons/console/filetools/down.svg'} alt={item.Title}
                                    className={open ? 'opened' : ''}
                                    onClick={() => {
                                        setOpen(!open)
                                        loadFiles(`${item.Path}`).then((result) => {
                                            console.log('NoteCard', result)
                                            if (result) {
                                                setNotesResult(result)
                                            }
                                        })
                                    }}/>}
            </div>
            <div className={'noteName'}>
                {item.Title}
            </div>
        </div>
        {notesResult && <FileList level={level} selectResult={notesResult}/>}
    </div>
}
