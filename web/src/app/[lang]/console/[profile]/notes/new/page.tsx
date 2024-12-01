import React from 'react' 

export default function Page() {
    return <div>
        EditPage
    </div>
    // const newModel: NoteModel = {
    //     uid: '',
    //     urn: '',
    //     title: '',
    //     header: 'markdown',
    //     body: '',
    //     create_time: '',
    //     update_time: '',
    //     keywords: '',
    //     description: '',
    //     cover: '',
    //     name: '',
    //     discover: 0,
    //     channel: '',
    //     channel_name: '',
    //     partition: '',
    //     path: '',
    //     owner: '',
    //     children: 0
    // }

    // return <MarkdownEditorForm model={newModel} onSubmit={async (newModel) => {
    //     const result = await clientMakeHttpPut<NoteModel>('/restful/article', newModel)
    //     console.debug('result', result)
    //     if (result && result.uid) {
    //         // router.replace('/console/articles')
    //         // router.refresh()
    //     }
    // }}/>
}
