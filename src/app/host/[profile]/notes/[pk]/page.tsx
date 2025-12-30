import React, {useEffect, useState} from 'react'
import {clientMakeHttpGet} from '@/services/client/http'
import {PSArticleModel} from "@/atom/common/models/article";
import {TocItem} from "@/atom/common/models/toc";
import {generatorRandomString} from "@/atom/common/utils/string";
import {BuildBodyHtml} from "@/atom/server/article";

interface IReadRequest {
    params: { pk: string }
}

export default function Page(request: IReadRequest) {
    const pk = request.params.pk
    const [model, setModel] = useState<PSArticleModel>()

    useEffect(() => {
        clientMakeHttpGet<PSArticleModel | undefined>('/posts/' + pk).then((result) => {
            if (result) {
                setModel(result)
            }
        })
    }, [pk])
    if (!model || !model.body) {
        return null
    }

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: model.title, header: 0, id: titleId})
    return <div className={'viewPage'}>
        <div className={'toolbar'}>
            <button>编辑</button>
            <button>分享</button>
            <button>删除</button>
        </div>
        <div className={'content'}>
            <BuildBodyHtml libUrl={''} assetsUrl={''} tocList={tocList} header={model.header} body={model.body}/>
        </div>
    </div>
}
