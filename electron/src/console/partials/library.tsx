import React, {useState} from 'react'
import {useEffect} from 'react'
import './library.scss'
import {PLSelectResult, PSFileModel} from "@pnnh/polaris-business";
import {filesMailbox} from "@/console/providers/notebook";

export function LibrarySelector() {
    const [libraryListState, setLibraryListState] = useState<PLSelectResult<PSFileModel>>()

    useEffect(() => {
        window.serverAPI.selectFiles('', {
            directory: true
        }).then(selectResult => {
            if (selectResult && selectResult.data && selectResult.data.range && selectResult.data.range.length > 0) {
                setLibraryListState(selectResult)
            }
        })
    }, [])

    if (!libraryListState || !libraryListState?.data ||
        !libraryListState.data.range || libraryListState.data.range.length <= 0) {
        return <div>暂无笔记本</div>
    }
    return <>
        <div className={'notebookSelector'}>
            <div className={'notebookTitle'}>
                <span>位置</span>
            </div>
        </div>
        {
            <div className={'libraryContainer'}>
                <div className={'libraryList'}>
                    {
                        libraryListState.data.range.map(item => {
                            return <div key={item.URN} className={'notebookItem'} onClick={() => {
                                filesMailbox.sendMail('abc', item)
                            }}>
                                <span className={'notebookName'}>{item.Name}</span>
                            </div>
                        })
                    }
                </div>
            </div>
        }
    </>
}
