import React from 'react'
import {MarkdownEditorForm} from '../../partials/edit'

interface IReadRequest {
    params: { pk: string }
}

export default function Page(request: IReadRequest) {
    const model = {} as any
    return <MarkdownEditorForm model={model} onSubmit={(newModel) => {
        if (!newModel) {
            return
        }

        // clientMakeHttpPut<NoteModel>('/restful/article', newModel).then((result) => {
        //     console.debug('result', result)
        //     if (result && result.urn) {
        //         // router.replace('/console/articles')
        //         // router.refresh()
        //     }
        // })
    }}/>
}
