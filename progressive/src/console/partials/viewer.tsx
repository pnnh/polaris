import React from 'react'
import {ArticleContainer} from "@/components/console/note";
import {PSNoteModel} from "@pnnh/polaris-business";
import {storeArticleToDatabase} from "@/services/server/notes";
import './viewer.scss'

export function ArticleEditorArea() {
    return <div>ArticleEditorArea</div>
    // if (!selectedArticle || !selectedArticle.current || !selectedArticle.current.body) {
    //     return <div>Loading</div>
    // }
    // const article = selectedArticle.current
    //
    // const changeArticle = (article: PSNoteModel) => {
    //     setSelectedArticle({
    //         current: article
    //     })
    //     storeArticleToDatabase(article).then(() => {
    //         console.log('ArticleStored', article.urn)
    //     })
    // }
    //
    // return <div className={'editorArea'}>
    //     <div className={'titleCol'}>
    //         <input value={selectedArticle.current.title} onChange={(event) => {
    //             changeArticle({
    //                     ...selectedArticle.current!,
    //                     title: event.target.value
    //                 }
    //             )
    //         }}/>
    //     </div>
    //     <div className={'editCol'}>
    //         <textarea className={'editText'} value={article.body} onChange={(event) => {
    //             changeArticle({
    //                 ...selectedArticle.current!,
    //                 body: event.target.value
    //             })
    //         }}></textarea>
    //     </div>
    //     <div className={'previewCol'}>
    //         <ArticleContainer tocList={[]} header={article.header} body={article.body} assetsUrl={'xxx'}/>
    //     </div>
    // </div>
}
