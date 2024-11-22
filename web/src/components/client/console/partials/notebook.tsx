'use client'

import React from 'react'
import './notebook.scss'
import {PSNotebookModel} from "@/models/common/personal/notebook";
import {PLSelectResult} from "@/models/common/common-result";
import {PSArticleModel} from "@/models/common/article";
import {clientMustSigninDomain, clientTrySigninDomain} from "@/services/client/domain";
import {encodeBase64String} from "@/utils/basex";
import {PSFileModel} from "@/models/common/filesystem";
import {filesMailbox} from "@/services/client/console/mailbox";
import {IMail} from "@/services/client/postoffice";

export function NotebookList() {
    return <div className={'notebookContainer'}>
        <div className={'notebookList'}>
            <div className={'functionLabel'}>资源管理器</div>
            <div className={'directoryBody'}>
                <div className={'directoryGroup'}>位置</div>
                <div className={'directoryList'}>
                    <div className={'directoryItem'} onClick={() => {
                        const domain = clientMustSigninDomain()
                        const urlParam = encodeBase64String('filesystem://home/server/files')
                        const rankUrl = `/restful/files?url=${urlParam}`
                        domain.makeGet<PLSelectResult<PSFileModel>>(rankUrl).then((selectResult) => {
                            console.log('selectResult', selectResult)

                            filesMailbox.sendMail('abc', selectResult)
                        })
                    }}>主目录
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function NotebookCard({item}: { item: PSNotebookModel }) {
    // const [notebookState, setNotebookState] = useRecoilState(notebookAtom)
    return <div>
        <div className={'directorySelf'} onClick={() => {
            // setNotebookState({
            //     models: notebookState.models,
            //     current: item
            // })
        }}>
            <div className={'directoryName'}>
                {item.title}</div>
        </div>
    </div>
}
