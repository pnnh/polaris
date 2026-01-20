'use client'

import React, {useEffect} from 'react'
import {useAtom, useAtomValue} from "jotai";
import {libraryAtom, notebookAtom} from "@/app/[lang]/host/providers/notebook";
import {clientSigninDomain} from "@/app/[lang]/host/services/client/domain";
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
    return <div className="notebookContainer">
        <div className="notebookList">
            {
                notebookState.models.map(item => {
                    return <NotebookCard key={item.uid} item={item}/>
                })
            }
        </div>
        <div className="newNotebook">新增笔记本</div>
        <style jsx>{`
          .notebookContainer {
            height: calc(100vh - 3rem);
          }
          .notebookList {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            overflow-y: auto;
            height: calc(100vh - 6rem);
          }
          .newNotebook {
            height: 3rem;
            display: flex;
            flex-direction: row;
            justify-items: center;
            align-items: center;
            border-top: solid 1px #e3e3e3;
            padding: 0 0.5rem;
          }
        `}</style>
    </div>
}

function NotebookCard({item}: { item: PSNotebookModel }) {
    const [notebookState, setNotebookState] = useAtom(notebookAtom)
    return <div>
        <div className="directorySelf" onClick={() => {
            setNotebookState({
                models: notebookState.models,
                current: item
            })
        }}>
            <div className="directoryName">
                {item.name}</div>
        </div>
        <style jsx>{`
          .directorySelf {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            height: 2.5rem;
            cursor: default;
          }
          .directorySelf:hover {
            background-color: #DFDFDF;
          }
          .directoryName {
            border: none;
            background-color: transparent;
            padding: 0;
            margin: 0;
            cursor: default;
            width: auto;
            padding-left: 4px;
          }
        `}</style>
    </div>
}
