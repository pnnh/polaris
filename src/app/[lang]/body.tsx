import React from 'react'
import {css} from "@/gen/styled/css";
import {transTodo} from "@/components/common/locales/normal";

const pageStyles = {
    pageContainer: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `,
    gridContainer: css`
        width: 960px;
        margin: 0 auto;
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    `,
    toolbar: css`
        display: flex;
        flex-direction: row;
        gap: 1rem;

    `
}

export default async function HomeBody({lang}: { lang: string }) {

    return <div className={pageStyles.pageContainer}>
        <div className={pageStyles.gridContainer}>
            <ToolsItemCard lang={lang}/>
            <NoteItemCard lang={lang}/>
            <ImageItemCard lang={lang}/>
            <ChannelItemCard lang={lang}/>
        </div>
    </div>
}


const cardStyles = {
    cardItem: css`
        padding: 12px;
        border-radius: 8px;
        transition: box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;

        img {
            height: 16rem;
            width: 16rem;
            object-fit: cover;
            border-radius: 8px;
        }

        a {
            font-size: 1.5rem;
            font-weight: bold;
            text-decoration: none;
            color: #333;
        }
    `
}

async function ToolsItemCard({lang}: { lang: string }) {
    return <div className={cardStyles.cardItem}>
        <img src={'/images/cover/tools.png'} alt={'tools'}/>
        <a href={`/${lang}/tools`}>{transTodo("工具")}</a>

    </div>
}

async function NoteItemCard({lang}: { lang: string }) {
    return <div className={cardStyles.cardItem}>

        <img src={'/images/cover/notes.jpeg'} alt={'notes'}/>
        <a href={`/${lang}/articles`}>{transTodo("笔记")}</a>

    </div>
}

async function ImageItemCard({lang}: { lang: string }) {
    return <div className={cardStyles.cardItem}>

        <img src={'/images/cover/album.jpg'} alt={'album'}/>
        <a href={`/${lang}/images`}>{transTodo("图片")}</a>

    </div>
}


async function ChannelItemCard({lang}: { lang: string }) {
    return <div className={cardStyles.cardItem}>

        <img src={'/images/cover/channels.webp'} alt={'channels'}/>
        <a href={`/${lang}/channels`}>{transTodo("频道")}</a>

    </div>
}

