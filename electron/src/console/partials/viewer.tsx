import React from 'react'
import {useRecoilState, useRecoilValue} from 'recoil'
import {ArticleContainer} from "@/components/console/note";
import {css} from "@emotion/css";
import {noteAtom} from "@/console/providers/notebook";
import {storeArticleToDatabase} from "@/services/client/personal/notes";
import {PSNoteModel} from "@pnnh/polaris-business";

const styles = {
    editorArea: css`
        height: 100%;
    `,
    titleCol: css`
        height: 3rem;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: solid 1px #e3e3e3;

        input {
            margin-left: 1rem;
            width: 98%;
            outline: none;
            border: 0;
            font-size: 1.5rem;
            font-weight: 400;
        }
    `,
    editCol: css`
        height: calc(60% - 3rem);
        border-left: solid 1px #e3e3e3;
    `,
    editText: css`
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
    `,
    previewCol: css`
        height: 40%;
        overflow-y: scroll;
        overflow-x: hidden;
        box-sizing: border-box;
        scrollbar-width: thin;
        padding: 1rem;
    `,
}

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
        storeArticleToDatabase(article).then(() => {
            console.log('ArticleStored', article.urn)
        })
    }

    return <div className={styles.editorArea}>
        <div className={styles.titleCol}>
            <input value={selectedArticle.current.title} onChange={(event) => {
                changeArticle({
                        ...selectedArticle.current!,
                        title: event.target.value
                    }
                )
            }}/>
        </div>
        <div className={styles.editCol}>
            <textarea className={styles.editText} value={article.body} onChange={(event) => {
                changeArticle({
                    ...selectedArticle.current!,
                    body: event.target.value
                })
            }}></textarea>
        </div>
        <div className={styles.previewCol}>
            <ArticleContainer tocList={[]} header={article.header} body={article.body} assetsUrl={'xxx'}/>
        </div>
    </div>
}
