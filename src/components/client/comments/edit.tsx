'use client'

import './edit.scss'
import React, {FormEvent, useEffect, useState} from "react";
import {validateEmail} from "@/atom/common/utils/email";
import {submitComment} from "@/services/client/comments/comment";
import {isValidUrl} from "@/atom/common/utils/uri";
import {CodeOk} from "@/atom/common/models/protocol";
import {ButtonThrottle} from "@/atom/client/button/throttle";
import {AccountModel} from "@/atom/common/models/account";
import {accountSignout, getUserinfo} from "@/services/client/account/account";
import Link from "next/link";

const buttonThrottle = new ButtonThrottle(5000)

export function EditArea({resource}: { resource: string }) {
    const [content, setContent] = useState('')
    const [photo, setPhoto] = useState('')
    const [infoMsg, setInfoMsg] = useState('')
    const [userinfo, setUserinfo] = React.useState<AccountModel | undefined>(undefined)

    const submitForm = async () => {
        if (!await buttonThrottle.throttle()) {
            setInfoMsg('操作过于频繁')
            return
        }
        if (!content) {
            setInfoMsg('无效内容')
            return
        }
        const submitRequest = {
            email: '', nickname: '', photo, website: '', content, turnstile_token: '',
            resource,
        }
        const submitResult = await submitComment(submitRequest)
        console.log('submitResult', submitResult)
        if (submitResult.code !== CodeOk) {
            setInfoMsg('评论提交失败')
            return
        }
        setInfoMsg('评论已提交审核后可见')
    }

    useEffect(() => {
        getUserinfo().then((result) => {
            if (!result || result.code != CodeOk || !result.data) {
                return
            }
            setUserinfo(result.data)
        })
    }, []);
    if (!userinfo) {
        return <div className={'loginTips'}>
            <Link className={'loginLink'} href={'/account/signin'}>登录</Link>后可以评论
        </div>
    }

    return <div className={'editContainer'}>
        <div className={'areaTitle'}>
            {'评论列表'}
        </div>
        <div className={'editRow'}>
            <div className={'infoColumn'}>
                <div className={'editorRow'}>
                    <textarea placeholder={"输入评论内容"} onChange={(e) => setContent(e.target.value)}/>
                </div>
                <div className={'actionsRow'}>
                    <div className={'submitArea'}>
                        <button className={'submitButton'} onClick={() => {
                            submitForm().catch(() => {
                                setInfoMsg('评论提交失败')
                            })
                        }}>发布
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

