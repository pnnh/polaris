import React from 'react'
import {TocItem} from "@pnnh/stele";
import {generatorRandomString} from "@pnnh/atom";
import {BuildBodyHtml} from "@pnnh/stele/server";
import {NoteModel} from "@/models/common/personal/note";

interface IReadRequest {
    params: { pk: string }
}

export default function Page(request: IReadRequest) {
    const model = {} as NoteModel
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
