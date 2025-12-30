import React from 'react'
import {MarkdownEditorForm} from '../partials/edit'
import {clientMakeHttpPut} from '@/services/client/http'
import {PSNoteModel} from "@/photon/common/models/personal/note";

export default function Page() {
    const newModel: PSNoteModel = {
        uid: '',
        title: '',
        header: 'markdown',
        body: '',
        create_time: '',
        update_time: '',
        keywords: '',
        description: '',
        cover: '',
        discover: 0,
        channel: '',
        partition: '',
        path: '',
        owner: '',
        creator: ''
    }

    return <MarkdownEditorForm model={newModel} onSubmit={async (newModel) => {
        const result = await clientMakeHttpPut<PSNoteModel>('/restful/article', newModel)
        console.debug('result', result)
        if (result && result.uid) {
            // router.replace('/console/articles')
            // router.refresh()
        }
    }}/>
}
