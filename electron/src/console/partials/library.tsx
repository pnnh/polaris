import React, {useState} from 'react'
import {useEffect} from 'react'
import './library.scss'
import {PLSelectResult, PSFileModel} from "@pnnh/polaris-business";
import {filesMailbox} from "@/console/providers/notebook";

export function LibrarySelector() {
    const [libraryListState, setLibraryListState] = useState<PLSelectResult<PSFileModel>>()

    useEffect(() => {
        window.serverAPI.getDomainPath().then((path) => {
            window.serverAPI.selectFiles(path, {
                directory: true
            }).then(selectResult => {
                if (selectResult && selectResult.data && selectResult.data.range && selectResult.data.range.length > 0) {
                    setLibraryListState(selectResult)
                }
            })
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
                            return <div key={item.URN} className={'notebookItem'} onClick={async () => {
                                filesMailbox.sendMail('abc', item)
                                // const currentDomainPath = await window.serverAPI.getDomainPath()
                                // const newPath = currentDomainPath + '/' + item.Path
                                window.serverAPI.setDomainPath(item.Url).then(() => {
                                    console.debug('Set Domain Path', item.Path)
                                    filesMailbox.sendMail('domainPath', item)
                                })
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
