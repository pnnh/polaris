import React, {useEffect, useState} from 'react'
import {TocItem} from '@/models/common/article'
import styles from './page.module.scss'
import {generatorRandomString} from "@pnnh/atom";
import {clientMakeHttpGet} from '@/services/client/http'
import {Button} from "@mui/material";
import {NPPictureModel} from "@pnnh/venus-business";

interface IReadRequest {
    params: { pk: string }
}

export default function Page(request: IReadRequest) {
    const pk = request.params.pk
    const [model, setModel] = useState<NPPictureModel>()

    useEffect(() => {
        clientMakeHttpGet<NPPictureModel | undefined>('/posts/' + pk).then((result) => {
            if (result) {
                setModel(result)
            }
        })
    }, [pk])
    if (!model) {
        return null
    }

    const tocList: TocItem[] = []
    const titleId = generatorRandomString(8)
    tocList.push({title: model.title, header: 0, id: titleId})
    return <div className={styles.viewPage}>
        <div className={styles.toolbar}>
            <Button>编辑</Button>
            <Button>分享</Button>
            <Button>删除</Button>
        </div>
        <div className={styles.content}>
            {/*<BuildBodyHtml assetsUrl={''} tocList={tocList} header={model.header} body={model.body}/>*/}
        </div>
    </div>
}
