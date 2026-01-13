import React from 'react'
import {transTodo} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";
import Button from "@mui/material/Button";
import {OpenToolbar} from "./toolbar";

const pageStyles = {
    pageContainer: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `,
    gridContainer: css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    `,
    toolbar: css`
        display: flex;
        flex-direction: row;
        gap: 1rem;

    `
}
export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    return <div className={pageStyles.pageContainer}>
        <div className={pageStyles.toolbar}>
            <OpenToolbar/>
            <Button>打开网络目录</Button>
        </div>
        <div className={pageStyles.gridContainer}>
            <FileItemCard model={{
                url: '/host/storage/files?dir=7ue33Yh26K2mAcDUKuR2XF13j2Y2Nw2KX6MrwL3qzyHKedcL',
                title: transTodo('目录1')
            }}/>
            <FileItemCard model={{
                url: '/host/storage/files?dir=3aJXN5FS5dBDZWuyivbWB4KUCf2rKdhxCserhigKCM7cVxNrjzvvn2AVPnxuxHZZVMkujn',
                title: transTodo('mac目录2')
            }}/>
            <NoteItemCard model={{
                url: '/host/notebook/notes?dir=RTpcV29ya3NwYWNlXGJsb2dcQ1BsdXMubm90ZWxpYnJhcnlcQ01ha2XnrJTorrDmnKwubm90ZWJvb2s=',
                title: transTodo('笔记本1')
            }}/>
            <NoteItemCard model={{
                url: '/host/notebook/notes?dir=3aJXN5FS5dBDZWuyivbWB4KUCf2rKdhxCserhigKCM7cVxNxEDNpbomYfuKGe4KQPx7uB6',
                title: transTodo('mac笔记本2')
            }}/>
            <ImageItemCard model={{
                url: '/host/album/images?dir=RTpcV29ya3NwYWNlXGJsb2dcaW1hZ2VzXOWFtuWugy5pbWFnZWNoYW5uZWw=',
                title: transTodo('相册1')
            }}/>
            <ImageItemCard model={{
                url: '/host/album/images?dir=9PWT5zYiBsrv5EKb3DTgwojwBLbuPcKXakMq8cToAwGvJuXnRKBTZcowjRM2kiVex5oWwVbYif1Tk3jvbu',
                title: transTodo('mac相册2')
            }}/>
        </div>
    </div>
}

interface CardProps {
    url: string
    title: string
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

async function FileItemCard({model}: { model: CardProps }) {
    return <div className={cardStyles.cardItem}>

        <a href={model.url}>{transTodo(model.title)}</a>

    </div>
}

async function NoteItemCard({model}: { model: CardProps }) {
    return <div className={cardStyles.cardItem}>

        <a href={model.url}>{transTodo(model.title)}</a>

    </div>
}

async function ImageItemCard({model}: { model: CardProps }) {
    return <div className={cardStyles.cardItem}>

        <a href={model.url}>{transTodo(model.title)}</a>

    </div>
}


