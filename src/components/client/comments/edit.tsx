'use client'

import React, {useEffect, useState} from "react";
import {CodeOk} from "@pnnh/atom";
import {ButtonThrottle} from "@pnnh/atom/browser";
import {submitComment} from "@/components/client/comments/comment";
import {getUserinfo} from "@/components/client/account/account";
import {transText} from "@/components/common/locales/normal";
import {AccountModel} from "@/components/common/models/account/account";

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
            setInfoMsg(transText(lang, '操作过于频繁，请稍后再试', 'Operation too frequent, please try again later'))
            return
        }
        if (!content) {
            setInfoMsg(transText(lang, '评论内容不能为空', 'Comment content cannot be empty'))
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
            setInfoMsg(transText(lang, '评论提交失败', 'Comment submission failed'))
            return
        }
        setInfoMsg(transText(lang, '评论提交成功', 'Comment submitted successfully'))
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
        <div className={'editContainer'}>
        <div className={'areaTitle'}>
            {transText(lang, '发表评论', 'Post a comment')}
        </div>
        <div className={'editRow'}>
            <div className={'infoColumn'}>
                <div className={'editorRow'}>
                    <textarea placeholder={transText(lang, "输入评论内容", 'Enter your comment')}
                              onChange={(e) => setContent(e.target.value)}/>
                </div>
                <div className={'actionsRow'}>
                    <div className={'submitArea'}>
                        <button className={'submitButton'} onClick={() => {
                            submitForm().catch((err) => {
                                console.error('submitForm', err)
                                setInfoMsg(transText(lang, '评论提交失败', 'Comment submission failed'))
                            })
                        }}>{transText(lang, '提交评论', 'Submit Comment')}
                        </button>
                    </div>
                    <div className={'infoMsg'}>
                        {infoMsg}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <style jsx>{`
      .editContainer .areaTitle {
        font-size: 1.1rem;
        font-weight: bold;
      }
      .editRow {
        display: flex;
        flex-direction: row;
        margin: 1rem auto;
        gap: 1rem;
      }
      .infoColumn {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        flex-grow: 1;
      }
      .editorRow {
        width: 100%;
        border: solid 1px #ccc;
        border-radius: 4px;
        min-height: 6rem;
        overflow: hidden;
      }
      .editorRow textarea {
        width: 100%;
        height: 100%;
        border: none;
        outline: none;
        font-size: 1rem;
        padding: 0.5rem;
      }
      .actionsRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .submitArea {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
      }
      .submitButton {
        padding: 0.3rem 0.8rem;
        background-color: #127af8;
        color: #FFFFFF;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 1rem;
        animation: buttonThrottle 2s step-end forwards;
      }
      .infoMsg {
        font-size: 0.9rem;
      }
    `}</style>
    </>
}
