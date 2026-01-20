'use client'

import React from 'react'
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

    return <div className="editorArea">
        <div className="titleCol">
            <input value={selectedArticle.current.title} onChange={(event) => {
                changeArticle({
                        ...selectedArticle.current!,
                        title: event.target.value
                    }
                )
            }}/>
        </div>
        <div className="editCol">
            <textarea className="editText" value={article.body} onChange={(event) => {
                changeArticle({
                    ...selectedArticle.current!,
                    body: event.target.value
                })
            }}></textarea>
        </div>
        <div className="previewCol">
            <ArticleContainer tocList={[]} header={article.header} body={article.body} assetsUrl={'xxx'}/>
        </div>
        <style jsx>{`
          .editorArea {
            height: 100%;
          }
          .titleCol {
            height: 3rem;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: solid 1px #e3e3e3;
          }
          .titleCol input {
            margin-left: 1rem;
            width: 98%;
            outline: none;
            border: 0;
            font-size: 1.5rem;
            font-weight: 400;
          }
          .editCol {
            height: calc(60% - 3rem);
            border-left: solid 1px #e3e3e3;
          }
          .editText {
            border: 0;
            box-shadow: none;
            resize: none;
            outline: none !important;
            overflow-x: hidden;
            padding: 1rem;
            width: calc(100% - 2rem);
            height: calc(100% - 2rem);
            scrollbar-width: thin;
            overflow-y: auto;
            border-bottom: solid 1px #e3e3e3;
          }
          .previewCol {
            height: 40%;
            overflow-y: scroll;
            overflow-x: hidden;
            box-sizing: border-box;
            scrollbar-width: thin;
            padding: 1rem;
          }
        `}</style>
    </div>
}
