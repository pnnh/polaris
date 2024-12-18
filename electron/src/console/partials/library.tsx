import React from 'react'
import {useEffect} from 'react'
import {useRecoilState} from 'recoil'
import './library.scss'
import {libraryAtom, libraryListAtom} from "@/console/providers/notebook";

export function LibrarySelector() {
    const [libraryListState, setLibraryListState] = useRecoilState(libraryListAtom)
    const [libraryState, setLibraryState] = useRecoilState(libraryAtom)

    useEffect(() => {
        window.serverAPI.selectFiles('', {
            directory: true
        }).then(selectResult => {
            if (selectResult && selectResult.data && selectResult.data.range && selectResult.data.range.length > 0) {
                setLibraryListState({
                    models: selectResult.data.range
                })
            }
        })
    }, [])

    if (!libraryListState || !libraryListState.models || libraryListState.models.length <= 0) {
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
                        libraryListState.models.map(item => {
                            return <div key={item.URN} className={'notebookItem'} onClick={() => {
                                setLibraryState({
                                    current: item
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
