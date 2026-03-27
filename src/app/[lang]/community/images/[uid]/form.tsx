'use client'

import {EmptyUUID} from "@pnnh/atom";
import { Button } from "@/components/ui/button";
import React from "react";
import {PSImageModel} from "@/components/common/models/image";
import {PSChannelModel} from "@/components/common/models/channel";
import MenuItem from '@mui/material/MenuItem';
import {Select} from "@mui/material";
import {transKey} from "@/components/common/locales/normal";
import {CommunityBrowser} from "@/components/community/browser";
import {css} from "@/gen/styled/css";
import {getDefaultImageUrl} from "@/components/common/note";

function PSConsoleChannelSelector({channelUid, channels, onChange, lang}: {
    channelUid: string,
    channels: PSChannelModel[],
    onChange: (newChannel: string) => void,
    lang: string
}) {
    return <>
        <Select
            value={channelUid}
            size={'small'}
            label="Channel"
            onChange={(event) => onChange(event.target.value)}
            displayEmpty
        >
            <MenuItem value="" disabled>
                {transKey(lang, "console.image.selectChannel")}
            </MenuItem>
            {
                channels.map(channel => (
                    <MenuItem key={channel.uid} value={channel.uid}
                              selected={channelUid === channel.uid} disableRipple>
                        {channel.name}
                    </MenuItem>
                ))
            }
        </Select>
    </>
}

export function ConsolePhotoForm({stargateUrl, modelString, channelsString, lang}: {
    stargateUrl: string,
    modelString: string,
    channelsString: string,
    lang: string
}) {
    const oldModel = JSON.parse(modelString) as PSImageModel;
    const channels = JSON.parse(channelsString) as PSChannelModel[];
    const [title, setTitle] = React.useState(oldModel.title || '');
    const [description, setDescription] = React.useState(oldModel.description || '');
    const [keywords, setKeywords] = React.useState(oldModel.keywords || '');
    const [selectedChannel, setSelectedChannel] = React.useState(oldModel.channel || '');

    const isNew = oldModel.uid === EmptyUUID;

    const onSubmit = () => {
        if (!selectedChannel) {
            alert(transKey(lang, "console.image.channelRequired"));
            return;
        }
        const newModel = {
            uid: oldModel.uid,
            title,
            description,
            keywords,
            channel: selectedChannel,
        }
        if (isNew) {
            CommunityBrowser.clientConsoleInsertImage(stargateUrl, newModel).then((imageId) => {
                if (!imageId) {
                    console.error(transKey(lang, "console.image.insertFailed"))
                    return
                }
                window.location.href = `/${lang}/community/images`
            })
        } else {
            CommunityBrowser.clientConsoleUpdateImage(stargateUrl, oldModel.uid, newModel).then((imageId) => {
                if (!imageId) {
                    console.error(transKey(lang, "console.image.updateFailed"))
                    return
                }
                window.location.href = `/${lang}/community/images`
            })
        }
    }

    return <div className={formStyles.bodyContainer}>
        <div className={formStyles.formSection}>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>
                    {transKey(lang, "console.image.title")}
                </label>
                <input
                    className={formStyles.fieldInput}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder={transKey(lang, "console.image.title")}
                />
            </div>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>
                    {transKey(lang, "console.image.description")}
                </label>
                <textarea
                    className={formStyles.fieldTextarea}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder={transKey(lang, "console.image.description")}
                />
            </div>
            <ImageCard lang={lang} model={oldModel}/>
            <div className={formStyles.fieldGroup}>
                <label className={formStyles.fieldLabel}>Keywords</label>
                <input
                    className={formStyles.fieldInput}
                    value={keywords}
                    onChange={(event) => setKeywords(event.target.value)}
                    placeholder="keywords"
                />
            </div>
        </div>
        <div className={formStyles.bottomBar}>
            <PSConsoleChannelSelector
                channelUid={selectedChannel}
                channels={channels}
                onChange={setSelectedChannel}
                lang={lang}
            />
            <Button size={'sm'} onClick={onSubmit}>
                {transKey(lang, "console.image.save")}
            </Button>
        </div>
    </div>
}

const formStyles = {
    bodyContainer: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
    `,
    formSection: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-width: 800px;
    `,
    fieldGroup: css`
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    `,
    fieldLabel: css`
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-primary-color);
    `,
    fieldInput: css`
        border: 1px solid #b4b4b4;
        border-radius: 4px;
        padding: 0.5rem;
        font-size: 0.9rem;
        width: 100%;
        box-sizing: border-box;
    `,
    fieldTextarea: css`
        border: 1px solid #b4b4b4;
        border-radius: 4px;
        padding: 0.5rem;
        font-size: 0.9rem;
        width: 100%;
        height: 6rem;
        resize: vertical;
        scrollbar-width: thin;
        box-sizing: border-box;
    `,
    bottomBar: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;
        padding-top: 0.5rem;
        border-top: 1px solid var(--border-color);
    `
}

function ImageCard({model, lang}: {
    model: PSImageModel,
    lang: string
}) {
    let imageUrl = model.url || getDefaultImageUrl()

    return <>
        <div className={imageStyles.imageCard}>
            {imageUrl && <img src={imageUrl} alt={model.name}/>}
        </div>
    </>
}

const imageStyles = {
    middleBody: css`
        display: grid;
        grid-template-columns: repeat(4, minmax(150px, 1fr));
        width: 100%;
    `,
    imageCard: css`
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;

        &:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        & img {
            height: 8rem;
            width: 8rem;
            object-fit: cover;
        }
    `
}
