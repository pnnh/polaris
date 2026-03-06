'use client'

import Button from "@mui/material/Button";
import React from "react";
import {PSChannelModel} from "@/components/common/models/channel";
import {clientConsoleInsertChannel, clientConsoleUpdateChannel} from "@/components/client/channels/channels";
import {EmptyUUID} from "@pnnh/atom";
import {getDefaultImageUrl} from "@/components/common/note";
import {transKey} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

export function ConsoleChannelForm({stargateUrl, modelString}: { stargateUrl: string, modelString: string }) {
    const oldModel = JSON.parse(modelString) as PSChannelModel;
    const [name, setName] = React.useState(oldModel.name);
    const [description, setDescription] = React.useState(oldModel.description || '');

    const isNew = oldModel.uid === EmptyUUID;
    const onSubmit = () => {
        const newModel = {
            uid: oldModel.uid,
            name: name,
            description: description,
        }
        if (isNew) {
            clientConsoleInsertChannel(stargateUrl, newModel).then((newChannelId) => {
                if (!newChannelId) {
                    console.error(transKey('en', "console.channel.insertFailed"))
                    return
                }
                window.location.href = `/en/community/channels`
            })
        } else {
            clientConsoleUpdateChannel(stargateUrl, oldModel.uid, newModel).then((channelId) => {
                if (!channelId) {
                    console.error(transKey('en', "console.channel.updateFailed"))
                    return
                }
                window.location.href = `/en/community/channels`
            })
        }
    }
    const coverUrl = oldModel.image || getDefaultImageUrl();
    return <div className={channelStyles.bodyContainer}>
        <div className={channelStyles.channelCover}>
            <div className={channelStyles.channelHeader}>
                <div className={channelStyles.channelTitle}>
                    <input placeholder="Channel Name" value={name} onChange={(event) => setName(event.target.value)}/>
                </div>
                <div className={channelStyles.channelDescription}>
                        <textarea name={'channelDescription'} placeholder="Channel Description"
                                  value={description} onChange={(event => setDescription(event.target.value))}/>
                </div>
            </div>
            <img className={channelStyles.coverImage} src={coverUrl} alt={oldModel.name}/>
        </div>
        <div className={channelStyles.bottomBar}>
            <Button variant={'contained'} size={'small'} onClick={onSubmit}>
                {transKey('en', "console.channel.save")}
            </Button>
        </div>
    </div>
}

const channelStyles = {
    bodyContainer: css`
        overflow: hidden;
    `,
    channelCover: css`
        width: calc(100vw - 16rem);
        height: 12rem;
        position: relative;
        border-radius: 6px;
        overflow: hidden;
        background: var(--background-color);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    `,
    channelHeader: css`
        flex-grow: 1;
        position: relative;
        z-index: 1;
        border-radius: 4px;
        overflow: hidden;
    `,
    channelTitle: css`
        font-weight: 600;
        font-size: 20px;
        margin-bottom: 16px;
        padding-left: 1rem;

        & input {
            width: calc(100% - 3rem);
            border-color: #b4b4b4;
            border-radius: 4px;
            border-width: 1px;
            padding: 0.5rem;
        }
    `,
    channelDescription: css`
        font-size: 1rem;
        color: var(--text-primary-color);
        padding-left: 1rem;

        & textarea {
            resize: none;
            width: calc(100% - 3rem);
            height: 5rem;
            border-color: #b4b4b4;
            border-radius: 4px;
            padding: 0.5rem;
            scrollbar-width: thin;
        }
    `,
    coverImage: css`
        width: 8rem;
        height: 8rem;
        flex-shrink: 0;
        object-fit: cover;
        top: 0;
        z-index: 0;
        margin-right: 1rem;
    `,
    bottomBar: css`
        height: 4rem;
        width: 100vw;
        background: var(--background-color);
        display: flex;
        flex-direction: row;
        justify-items: center;
        align-items: center;
        gap: 1rem;
        padding-left: 1rem;

        @media screen and (min-width: 80rem) {
            width: 80vw;
            margin: 1rem auto 0 auto;
        }
    `
}
