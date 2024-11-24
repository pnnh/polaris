import React from 'react'
import {MarkdownEditorForm} from '../partials/edit'
import {clientMakeHttpPut} from '@/services/client/http'
import {NPPictureModel} from "@pnnh/venus-business";

export default function Page() {
    const newModel: NPPictureModel = {
        file: "", folder: "", nid: 0, status: 0,
        uid: '',
        urn: '',
        title: '',
        create_time: '',
        update_time: '',
        description: '',
        owner: ''
    }

    // return <MarkdownEditorForm model={newModel} onSubmit={async (newModel) => {
    //     const result = await clientMakeHttpPut<NPPictureModel>('/restful/article', newModel)
    //     console.debug('result', result)
    //     if (result && result.uid) {
    //         // router.replace('/console/articles')
    //         // router.refresh()
    //     }
    // }}/>
    return <></>
}
