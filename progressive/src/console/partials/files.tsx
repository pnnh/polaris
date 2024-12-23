import React from 'react'
import {useEffect, useState} from 'react'
import {PLSelectResult, PSFileModel, PSNotebookModel} from '@pnnh/polaris-business'
import './files.scss'
import {filesMailbox} from "@/console/providers/notebook";

export function FileListContainer() {
    const [filesState, setFilesState] = useState<PLSelectResult<PSFileModel>>()
    useEffect(() => {
        const stub = filesMailbox.subscribe<PSFileModel>('abc', (mail) => {
            console.log('subscribe22', mail)
            const fileModel = mail.content as PSFileModel
            window.serverAPI.selectFiles(fileModel.Path, undefined).then(selectResult => {
                setFilesState(selectResult)
            })
        })
        console.log('registerComponent')
        return () => {
            console.log('unregisterComponent')
            filesMailbox.unsubscribe(stub)
        }
    }, [])

    if (!filesState || !filesState.data || !filesState.data.range || filesState.data.range.length <= 0) {
        return <div>Empty</div>
    }
    return <div className={'fileListContainer'}>
            {
                filesState.data.range.map(item => {
                    return <FileList key={item.URN} item={item} filesResult={filesState} level={0}/>
                })
            }
    </div>
}

function FileList({item, filesResult, level}: { item: PSFileModel,
    filesResult: PLSelectResult<PSFileModel>, level: number }) {

    const [childrenFilesState, setChildrenFilesState] = useState<PLSelectResult<PSFileModel>>()

    return <div className={'fileList'}>
        <div className={'directorySelf'} style={{paddingLeft: level.toString() + 'rem'}}>
            <div className={'openIcon'}>
                {
                    item.IsDir &&
                    <img src={!childrenFilesState ? '/icons/console/triangle-right-fill.png' :
                        '/icons/console/triangle-down-fill.png'} alt={'open'}
                    onClick={() => {
                        if (!childrenFilesState) {
                            window.serverAPI.selectFiles(item.Path, undefined).then(selectResult => {
                                setChildrenFilesState(selectResult)
                            })
                        } else {
                            setChildrenFilesState(undefined)
                        }
                    }}/>
                }
            </div>
            <div className={'directoryName'}>
                {item.Name}
            </div>
        </div>
        <div className={'childrenFileList'}>
            { childrenFilesState && childrenFilesState.data && childrenFilesState.data.range && childrenFilesState.data.range.length > 0 &&
                childrenFilesState.data.range.map(item => {
                    return <FileList key={item.URN} item={item} filesResult={childrenFilesState}
                        level={level + 1}/>
                })
            }
        </div>
    </div>
}
