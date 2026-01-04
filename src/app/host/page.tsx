import React from 'react'
import {transTodo} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";
import Button from "@mui/material/Button";
import {HostNavbar} from "@/app/host/navbar";
import {HostToolbar} from "@/app/host/toolbar";


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
    `
}
export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    return <div className={pageStyles.pageContainer}>
        <HostToolbar/>
        <div className={pageStyles.gridContainer}>
            <FileItemCard model={{}}/>
            <NoteItemCard model={{}}/>
            <ImageItemCard model={{}}/>
        </div>
    </div>
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

async function FileItemCard({model}: { model: any }) {
    return <div className={cardStyles.cardItem}>

        <a href={'/host/storage/files?dir=7ue33Yh26K2mAcDUKuR2XF13j2Y2Nw2KX6MrwL3qzyHKedcL'}>{transTodo('目录1')}</a>

    </div>
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


