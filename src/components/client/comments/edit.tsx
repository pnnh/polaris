'use client'

import './edit.scss'
import React, {useEffect, useState} from "react";
import {CodeOk} from "@/atom/common/models/protocol";
import {ButtonThrottle} from "@/atom/client/button/throttle";
import {AccountModel} from "@/atom/common/models/account";
import {submitComment} from "@/components/client/comments/comment";
import {getUserinfo} from "@/components/client/account/account";
import {localText} from "@/atom/common/language";

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
            setInfoMsg(localText(lang, '操作过于频繁，请稍后再试', 'Operation too frequent, please try again later'))
            return
        }
        if (!content) {
            setInfoMsg(localText(lang, '评论内容不能为空', 'Comment content cannot be empty'))
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
            setInfoMsg(localText(lang, '评论提交失败', 'Comment submission failed'))
            return
        }
        setInfoMsg(localText(lang, '评论提交成功', 'Comment submitted successfully'))
    }

    useEffect(() => {
        getUserinfo(portalUrl).then((result) => {
            if (!result || result.code != CodeOk || !result.data) {
                return
            }
            setUserinfo(result.data)
        })
    }, []);

    return <div className={'editContainer'}>
        <div className={'areaTitle'}>
            {localText(lang, '发表评论', 'Post a comment')}
        </div>
        <div className={'editRow'}>
            <div className={'infoColumn'}>
                <div className={'editorRow'}>
                    <textarea placeholder={localText(lang, "输入评论内容", 'Enter your comment')}
                              onChange={(e) => setContent(e.target.value)}/>
                </div>
                <div className={'actionsRow'}>
                    <div className={'submitArea'}>
                        <button className={'submitButton'} onClick={() => {
                            submitForm().catch((err) => {
                                console.error('submitForm', err)
                                setInfoMsg(localText(lang, '评论提交失败', 'Comment submission failed'))
                            })
                        }}>{localText(lang, '提交评论', 'Submit Comment')}
                        </button>
                    </div>
                    <div className={'infoMsg'}>
                        {infoMsg}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

