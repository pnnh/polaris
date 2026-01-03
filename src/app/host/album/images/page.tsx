import React from 'react'
import {serverMakeGet} from "@pnnh/atom/nodejs";
import {useServerConfig} from "@/components/server/config";
import {encodeBase58String, encodeBase64String, formatRfc3339, PLSelectResult, stringToBase58} from "@pnnh/atom";
import {PSImageModel} from "@/components/common/models/image";

import {langEnUS} from "@/components/common/language";
import {FaEye} from "react-icons/fa";
import {CiAlarmOn} from "react-icons/ci";
import {PSImageServer} from "@/components/server/image";
import {css} from "@/gen/styled/css";


const styles = {
    imageGrid: css`
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    `,
    imageCard: css`

    `,
    imageCover: css`
        flex-shrink: 0;
        position: relative;
        margin-right: 1rem;
        width: 6rem;
        height: 6rem;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 2px;
        }
    `,
    imageInfo: css`

        display: flex;
        padding: 0.5rem 1rem;
        flex-direction: column;
        justify-content: flex-start;
        flex-grow: 1;

    `,
    imageTitle: css`

        height: 1.5rem;
        flex-shrink: 0;
        font-weight: 600;
        font-size: 16px;
        line-height: 24px;
        color: #252933;
        overflow: hidden;

        a {
            color: #252933;
            text-decoration: none;
        }
    `,
    imageAction: css`

        height: 1rem;
        color: #8a919f;
        font-size: 12px;
        line-height: 22px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        gap: 6px;`
}

export default async function Page({searchParams}: {
    searchParams: Promise<Record<string, string>>
}) {
    const searchParamsValue = await searchParams
    const dir = searchParamsValue.dir
    if (!dir) {
        throw new Error("Not Found")
    }
    const serverConfig = await useServerConfig()
    const serverUrl = serverConfig.INTERNAL_PORTAL_URL
    const url = `${serverUrl}/host/album/images?dir=${encodeURIComponent(dir)}`
    const selectResult = await serverMakeGet<PLSelectResult<PSImageModel>>(url, '')
    if (!selectResult || selectResult.code !== 200) {
        throw new Error("host notebook")
    }
    const publicPortalUrl = serverConfig.PUBLIC_PORTAL_URL

    return <>
        <div className={styles.imageGrid}>
            {
                selectResult.data.range.map((model) => {
                    return <ImageCard key={model.uid} model={model} publicPortalUrl={publicPortalUrl}/>
                })
            }
        </div>
    </>
}

export function ImageCard({model, publicPortalUrl}: {
    model: PSImageModel, publicPortalUrl: string
}) {
    const uid = stringToBase58(model.url, 'base58')
    const imageUrl = `${publicPortalUrl}/host/album/images/file?file=${uid}`
    const contentUrl = `/host/album/images/${uid}`
    return <div className={styles.imageCard} key={model.uid}>
        <div className={styles.imageCover} data-article={model.uid}>
            <PSImageServer lang={langEnUS} src={imageUrl} alt={model.title} fill={true}/>
        </div>
        <div className={styles.imageInfo}>
            <div className={styles.imageTitle}>
                <a href={contentUrl} title={model.uid}>{model.title}</a></div>
            <div className={styles.imageAction}>
                <FaEye size={'1rem'}/><span>{model.discover}</span>
                <CiAlarmOn size={'1rem'}/><span>{formatRfc3339(model.update_time)}</span>
            </div>
        </div>
    </div>
}
