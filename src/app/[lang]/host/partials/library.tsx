'use client'

import React, {useEffect, useState} from 'react'
import {useAtom} from "jotai";
import {libraryAtom} from "@/app/[lang]/host/providers/notebook";
import {clientSigninDomain} from "@/app/[lang]/host/services/client/domain";

export function LibrarySelector() {
    const [notebookDropdown, setLibraryDropdown] = useState<boolean>(false)
    const [libraryState, setLibraryState] = useAtom(libraryAtom)

    useEffect(() => {
        clientSigninDomain().then(async domain => {
            const selectResult = await domain.selectLibraries()
            if (selectResult && selectResult.data
                && selectResult.data.range && selectResult.data.range.length > 0) {
                setLibraryState({
                    models: selectResult.data.range,
                    current: selectResult.data.range[0]
                })
            }
        })
    }, [])

    if (!libraryState || !libraryState.models || libraryState.models.length <= 0 || !libraryState.current) {
        return <div>暂无笔记本</div>
    }
    const defaultLibrary = libraryState.current
    return <>
        <div className="notebookSelector">
            <div className="notebookTitle">
                <span>{defaultLibrary.name}</span>
                <img src='/icons/console/down-arrow.png' alt='选择笔记本' width={24} height={24}
                     onClick={() => setLibraryDropdown(!notebookDropdown)}></img>
            </div>
            <div className="notebookAction">
                <img src='/icons/console/new-file-fill.png' alt='创建笔记' width={16} height={16}></img>
                <img src='/icons/console/new-folder-fill.png' alt='创建目录' width={16} height={16}></img>
            </div>
        </div>
        {
            notebookDropdown && <div className="libraryContainer">
                <div className="libraryList">
                    {
                        libraryState.models.map(item => {
                            return <div key={item.uid} className="notebookItem" onClick={() => {
                                setLibraryDropdown(!notebookDropdown)
                                setLibraryState({
                                    models: libraryState.models,
                                    current: item
                                })
                            }}>
                                <span className="notebookName">{item.name}</span>
                            </div>
                        })
                    }
                </div>
                <div className="newLibrary">新增资料库</div>
            </div>
        }
        <style jsx>{`
          .notebookSelector {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background-color: #f2f2f2;
            border-bottom: solid 1px #e3e3e3;
            height: 3rem;
          }
          .notebookTitle {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-items: center;
            gap: 4px;
            padding: 0 0.5rem;
          }
          .notebookAction {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 0 0.5rem;
          }
          .libraryContainer {
            position: absolute;
            background-color: #F9F9F9;
            width: 100%;
            height: calc(100vh - 3rem);
            top: 3rem;
            font-size: 1rem;
            font-weight: 400;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          .libraryList {
            height: calc(100vh - 6rem);
          }
          .notebookItem {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            height: 2.5rem;
            padding: 0 0.5rem;
            gap: 0.5rem;
            cursor: default;
          }
          .notebookItem:hover {
            background-color: #DFDFDF;
          }
          .notebookName {
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.6;
            color: #000;
          }
          .newLibrary {
            height: 3rem;
            display: flex;
            flex-direction: row;
            justify-items: center;
            align-items: center;
            border-top: solid 1px #e3e3e3;
            padding: 0 0.5rem;
          }
        `}</style>
    </>
}
