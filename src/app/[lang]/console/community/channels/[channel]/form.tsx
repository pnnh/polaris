'use client'

import {FormControlLabel, Radio, RadioGroup} from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import {PSChannelModel} from "@/components/common/models/channel";
import {clientConsoleInsertChannel, clientConsoleUpdateChannel} from "@/components/client/channels/channels";
import {EmptyUUID} from "@pnnh/atom";
import {getDefaultImageUrl} from "@/components/common/note";
import {transKey} from "@/components/common/locales/normal";

export function ConsoleChannelForm({publicPortalUrl, modelString}: { publicPortalUrl: string, modelString: string }) {
    const oldModel = JSON.parse(modelString) as PSChannelModel;
    const [lang, setLang] = React.useState(oldModel.lang);
    const [name, setName] = React.useState(oldModel.name);
    const [title, setTitle] = React.useState(oldModel.title);
    const [description, setDescription] = React.useState(oldModel.description);

    const isNew = oldModel.uid === EmptyUUID;
    const onSubmit = () => {
        const newModel = {
            uid: oldModel.uid,
            title: title,
            description: description,
            lang: oldModel.lang,
            name: name,
        }
        if (isNew) {
            clientConsoleInsertChannel(publicPortalUrl, newModel).then((newChannelId) => {
                if (!newChannelId) {
                    console.error(transKey(lang, "console.channel.insertFailed"))
                    return
                }
                window.location.href = `/${lang}/console/channels`
            })
        } else {
            clientConsoleUpdateChannel(publicPortalUrl, oldModel.uid, newModel).then((channelId) => {
                if (!channelId) {
                    console.error(transKey(lang, "console.channel.updateFailed"))
                    return
                }
                window.location.href = `/${lang}/console/channels`
            })
        }
    }
    const coverUrl = oldModel.image || getDefaultImageUrl();
    return <div className="bodyContainer">
        <div className="channelCover">
            <div className="channelHeader">
                <div>
                    <input value={name} onChange={(event) => setName(event.target.value)}/>
                </div>
                <div className="channelTitle">
                    <input value={title} onChange={(event) => setTitle(event.target.value)}/>
                </div>
                <div className="channelDescription">
                        <textarea name={'channelDescription'}
                                  value={description} onChange={(event => setDescription(event.target.value))}/>
                </div>
            </div>
            <img className="coverImage" src={coverUrl} alt={oldModel.title}/>
        </div>
        <div className="bottomBar">
            <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group" value={lang}
                        onChange={(event) => setLang(event.target.value)}>
                <FormControlLabel value="zh" control={<Radio/>} label="中文"/>
                <FormControlLabel value="en" control={<Radio/>} label="English"/>
            </RadioGroup>
            <Button variant={'contained'} size={'small'} onClick={onSubmit}>{
                transKey(lang, "console.channel.save")
            }</Button>
            <Button variant={'contained'} size={'small'}>{
                transKey(lang, "console.channel.createMultilingualCopy")
            }</Button>
        </div>
        <style jsx>{`
            .bodyContainer {
                overflow: hidden;
            }

            .channelCover {
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
            }

            .channelHeader {
                flex-grow: 1;
                position: relative;
                z-index: 1;
                border-radius: 4px;
                overflow: hidden;
            }

            .channelTitle {
                font-weight: 600;
                font-size: 20px;
                margin-bottom: 16px;
                padding-left: 1rem;
            }

            .channelTitle input {
                width: calc(100% - 3rem);
                border-color: #b4b4b4;
                border-radius: 4px;
                border-width: 1px;
                padding: 0.5rem;
            }

            .channelDescription {
                font-size: 1rem;
                color: var(--text-primary-color);
                padding-left: 1rem;
            }

            .channelDescription textarea {
                resize: none;
                width: calc(100% - 3rem);
                height: 5rem;
                border-color: #b4b4b4;
                border-radius: 4px;
                padding: 0.5rem;
                scrollbar-width: thin;
            }

            .coverImage {
                width: 8rem;
                height: 8rem;
                flex-shrink: 0;
                object-fit: cover;
                top: 0;
                z-index: 0;
                margin-right: 1rem;
            }

            .bottomBar {
                height: 4rem;
                width: 100vw;
                background: var(--background-color);
                display: flex;
                flex-direction: row;
                justify-items: center;
                align-items: center;
                gap: 1rem;
                padding-left: 1rem;
            }

            @media screen and (min-width: 80rem) {
                .bottomBar {
                    width: 80vw;
                    margin: 1rem auto 0 auto;
                }
            }
        `}</style>
    </div>
}
