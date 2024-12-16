import React, {useState} from 'react'
import styles from './edit.module.scss'
import {NoteModel} from "@/models/personal/note";
import {NoteContentView} from "@/components/console/note";
import {Button, Input} from "@mui/material";

export function MarkdownEditorForm(props: { model: NoteModel, onSubmit?: (model: NoteModel) => void }) {
    const model = props.model
    const onSubmit = props.onSubmit
    const [title, setTitle] = useState<string>(model.title)
    const [content, setContent] = useState<string>(model.body)

    return <div className={styles.editorForm}>
        <div>
            <Input
                placeholder="文章标题"
                value={title}
                onChange={(event) => {
                    setTitle(event.target.value)
                }}
            />
        </div>
        <div className={styles.editorRow}>
            <div className={styles.textCol}>
          <textarea
              className={styles.textarea}
              value={content}
              onChange={(e) => {
                  setContent(e.target.value)
              }}
          ></textarea>
            </div>
            <div className={styles.previewCol}>
                <NoteContentView header={model.header} content={content}/>
            </div>
        </div>
        <div className={'mt-3'}>
            <Button onClick={async () => {
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
            </Button>
        </div>
    </div>
}
