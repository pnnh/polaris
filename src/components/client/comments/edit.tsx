'use client'

import React, {useEffect, useState} from "react";
import {CodeOk} from "@pnnh/atom";
import {ButtonThrottle} from "@pnnh/atom/browser";
import {submitComment} from "@/components/client/comments/comment";
import {getUserinfo} from "@/components/client/account/account";
import {transKey} from "@/components/common/locales/normal";
import {AccountModel} from "@/components/common/models/account/account";
import {css} from "@/gen/styled/css";

const buttonThrottle = new ButtonThrottle(2000)

export function EditArea({lang, portalUrl, resource}: {
    portalUrl: string,
    resource: string, lang: string
}) {
    const [content, setContent] = useState('')
    const [photo, setPhoto] = useState('')
    const [infoMsg, setInfoMsg] = useState('')
    const [userinfo, setUserinfo] = React.useState<AccountModel | undefined>(undefined)

    const submitForm = async () => {
        if (!await buttonThrottle.throttle()) {
            setInfoMsg(transKey(lang, "frequentOperation"))
            return
        }
        if (!content) {
            setInfoMsg(transKey(lang, "comments.cannotBeEmpty"))
            return
        }
        const submitRequest = {
            userinfo,
            email: '', nickname: '', photo, website: '', content, turnstile_token: '',
            resource,
        }
        const submitResult = await submitComment(portalUrl, submitRequest)
        console.log('submitResult', submitResult)
        if (submitResult.code !== CodeOk) {
            setInfoMsg(transKey(lang, "comments.submissionFailed"))
            return
        }
        setInfoMsg(transKey(lang, "comments.submittedSuccessfully"))
    }

    useEffect(() => {
        getUserinfo(portalUrl).then((result) => {
            if (!result || result.code != CodeOk || !result.data) {
                return
            }
            setUserinfo(result.data)
        })
    }, []);

    return <>
        <div className={editStyles.editContainer}>
            <div className={editStyles.areaTitle}>
                {transKey(lang, "comments.postComment")}
            </div>
            <div className={editStyles.editRow}>
                <div className={editStyles.infoColumn}>
                    <div className={editStyles.editorRow}>
                    <textarea placeholder={transKey(lang, "comments.enterComment")}
                              onChange={(e) => setContent(e.target.value)}/>
                    </div>
                    <div className={editStyles.actionsRow}>
                        <div className={editStyles.submitArea}>
                            <button className={editStyles.submitButton} onClick={() => {
                                submitForm().catch((err) => {
                                    console.error('submitForm', err)
                                    setInfoMsg(transKey(lang, "comments.submissionFailed"))
                                })
                            }}>{transKey(lang, "comments.submitComment")}
                            </button>
                        </div>
                        <div className={editStyles.infoMsg}>
                            {infoMsg}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

const editStyles = {
    editContainer: css`
        & .areaTitle {
            font-size: 1.1rem;
            font-weight: bold;
        }
    `,
    areaTitle: css`
        font-size: 1.1rem;
        font-weight: bold;
    `,
    editRow: css`
        display: flex;
        flex-direction: row;
        margin: 1rem auto;
        gap: 1rem;
    `,
    infoColumn: css`
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex-grow: 1;
    `,
    editorRow: css`
        width: 100%;
        border: solid 1px #ccc;
        border-radius: 4px;
        min-height: 6rem;
        overflow: hidden;

        & textarea {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            font-size: 1rem;
            padding: 0.5rem;
        }
    `,
    actionsRow: css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    `,
    submitArea: css`
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    `,
    submitButton: css`
        padding: 0.3rem 0.8rem;
        background-color: #127af8;
        color: #FFFFFF;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        animation: buttonThrottle 2s step-end forwards;
    `,
    infoMsg: css`
        font-size: 0.9rem;
    `
}
