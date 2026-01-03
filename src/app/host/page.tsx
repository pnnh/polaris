import React from 'react'
import {transTodo} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";


const pageStyles = {
    pageContainer: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    `
}
export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    return <>
        <div className={pageStyles.pageContainer}>

            <NoteItemCard model={{}}/>
            <ImageItemCard model={{}}/>
        </div>
    </>
}

const cardStyles = {
    cardItem: css`
        padding: 12px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        background-color: #fafafa;
        transition: box-shadow 0.3s ease;
    `
}

async function NoteItemCard({model}: { model: any }) {
    return <div className={cardStyles.cardItem}>

        <a href={'/host/notebook/notes?dir=RTpcV29ya3NwYWNlXGJsb2dcQ1BsdXMubm90ZWxpYnJhcnlcQ01ha2XnrJTorrDmnKwubm90ZWJvb2s='}>{transTodo('笔记本1')}</a>

    </div>
}

async function ImageItemCard({model}: { model: any }) {
    return <div className={cardStyles.cardItem}>

        <a href={'/host/album/images?dir=RTpcV29ya3NwYWNlXGJsb2dcaW1hZ2VzXOWFtuWugy5pbWFnZWNoYW5uZWw='}>{transTodo('相册1')}</a>

    </div>
}


