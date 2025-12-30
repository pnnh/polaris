import React, {useState} from 'react'
import './edit.scss'
import {PSArticleModel} from "@/atom/common/models/article";

export function MarkdownEditorForm(props: { model: PSArticleModel, onSubmit?: (model: PSArticleModel) => void }) {
    const model = props.model
    const onSubmit = props.onSubmit
    const [title, setTitle] = useState<string>(model.title)
    const [content, setContent] = useState<string>(model.body)

    return <div className={'editorForm'}>
        <div>
            <input
                placeholder="文章标题"
                value={title}
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
            />
        </div>
        <div className={'editorRow'}>
            <div className={'textCol'}>
          <textarea
              className={'textarea'}
              value={content}
              onChange={(e) => {
                  setContent(e.target.value)
              }}
          ></textarea>
            </div>
            <div className={'previewCol'}>
                {/*<NoteContentView header={model.header} content={content}/>*/}
            </div>
        </div>
        <div className={'mt-3'}>
            <button onClick={async () => {
                if (!onSubmit) {
                    return
                }
                const newModel = {
                    ...model,
                    title,
                    body: content
                }
                onSubmit(newModel)
            }}>保存文章
            </button>
        </div>
    </div>
}
