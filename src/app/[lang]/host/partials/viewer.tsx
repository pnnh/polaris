'use client'
import React from 'react'
import './viewer.scss'
import {useAtom} from "jotai";
import {noteAtom} from "@/app/[lang]/host/providers/notebook";
import {PSArticleModel} from "@/components/common/models/article";
import {storeArticleToDatabase} from "@/app/[lang]/host/services/client/personal/notes";
import {ArticleContainer} from "@/app/[lang]/host/partials/note";

export function ArticleEditorArea() {
    const [selectedArticle, setSelectedArticle] = useAtom(noteAtom)
    if (!selectedArticle || !selectedArticle.current || !selectedArticle.current.body) {
        return <div>Loading</div>
    }
    const article = selectedArticle.current

    const changeArticle = (article: PSArticleModel) => {
        setSelectedArticle({
            current: article
        })
        storeArticleToDatabase(article).then(() => {
            console.log('ArticleStored', article.uid)
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
