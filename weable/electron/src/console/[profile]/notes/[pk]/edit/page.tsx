import React, {useEffect, useState} from 'react'
import {MarkdownEditorForm} from '../../partials/edit'
import {clientMakeHttpGet, clientMakeHttpPut} from '@/services/client/http'
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

    // return <MarkdownEditorForm model={model} onSubmit={(newModel) => {
    //     if (!newModel) {
    //         return
    //     }
    //
    //     clientMakeHttpPut<NoteModel>('/restful/article', newModel).then((result) => {
    //         console.debug('result', result)
    //         if (result && result.uid) {
    //             // router.replace('/console/articles')
    //             // router.refresh()
    //         }
    //     })
    // }}/>
    return <></>
}
