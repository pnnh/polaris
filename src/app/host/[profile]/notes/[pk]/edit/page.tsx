import React, {useEffect, useState} from 'react'
import {MarkdownEditorForm} from '../../partials/edit'
import {clientMakeHttpGet, clientMakeHttpPut} from '@/services/client/http'
import {PSArticleModel} from "@/atom/common/models/article";

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

    return <MarkdownEditorForm model={model} onSubmit={(newModel) => {
        if (!newModel) {
            return
        }

        clientMakeHttpPut<PSArticleModel>('/restful/article', newModel).then((result) => {
            console.debug('result', result)
            if (result && result.uid) {
                // router.replace('/console/articles')
                // router.refresh()
            }
        })
    }}/>
}
