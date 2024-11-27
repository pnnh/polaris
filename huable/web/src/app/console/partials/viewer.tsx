'use client'
import React from 'react'
import {useRecoilState, useRecoilValue} from 'recoil'
import './viewer.scss'
import {PSNoteModel} from "@/models/personal/note";
import {noteAtom} from "@/app/console/providers/notebook";
import {ArticleContainer} from "@/components/client/article";

export function ArticleEditorArea() {
    const [selectedArticle, setSelectedArticle] = useRecoilState(noteAtom)
    if (!selectedArticle || !selectedArticle.current || !selectedArticle.current.body) {
        return <div>Loading</div>
    }
    const article = selectedArticle.current

    const changeArticle = (article: PSNoteModel) => {
        setSelectedArticle({
            current: article
        })
    }

    return <div className={'editorArea'}>
        <div className={'titleCol'}>
            <input value={selectedArticle.current.title} onChange={(event) => {
                changeArticle({
                        ...selectedArticle.current!,
                        title: event.target.value
                    }
                )
            }}/>
        </div>
        <div className={'editCol'}>
            <textarea className={'editText'} value={article.body} onChange={(event) => {
                changeArticle({
                    ...selectedArticle.current!,
                    body: event.target.value
                })
            }}></textarea>
        </div>
        <div className={'previewCol'}>
            <ArticleContainer tocList={[]} header={article.header} body={article.body} assetsUrl={'xxx'}/>
        </div>
    </div>
}
