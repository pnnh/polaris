'use client'

import './edit.scss'
import {FormEvent, useState} from "react";
import {validateEmail} from "@/atom/common/utils/email";
import {submitComment} from "@/services/client/comments/comment";
import {isValidUrl} from "@/atom/common/utils/uri";
import {CodeOk} from "@/atom/common/models/protocol";
import {ButtonThrottle} from "@/atom/client/button/throttle";

const buttonThrottle = new ButtonThrottle(5000)

export function EditArea({resource}: { resource: string }) {
    const [email, setEmail] = useState('')
    const [nickname, setNickname] = useState('')
    const [website, setWebsite] = useState('')
    const [content, setContent] = useState('')
    const [photo, setPhoto] = useState('')
    const [infoMsg, setInfoMsg] = useState('')

    const submitForm = async () => {
        if (!await buttonThrottle.throttle()) {
            setInfoMsg('操作过于频繁')
            return
        }
        if (email && !validateEmail(email)) {
            setInfoMsg('无效邮箱')
            return
        }
        if (website && !isValidUrl(website)) {
            setInfoMsg('无效网址')
            return
        }
        if (!content) {
            setInfoMsg('无效内容')
            return
        }
        // const turnstileToken = await getTurnstileToken()
        // console.log('turnstile token', turnstileToken)
        // if (!turnstileToken) {
        //     setInfoMsg('未通过验证')
        //     return
        // }
        const submitRequest = {
            email, nickname, photo, website, content, turnstile_token: '',
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

    return <div className={'editContainer'}>
        <div className={'areaTitle'}>
            {'评论列表'}
        </div>
        <div className={'editRow'}>
            <div className={'infoColumn'}>
                <div className={'fieldsRow'}>
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{'昵称'}</div>
                        <div className={'fieldValue'}>
                            <input type={'text'} title={'optional'} placeholder={'可选输入'}
                                   onChange={(e) => setNickname(e.target.value)}/>
                        </div>
                    </div>
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{'邮箱'}</div>
                        <div className={'fieldValue'}>
                            <input type={'email'} title={'optional'} placeholder={'可选输入'}
                                   onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                    </div>
                </div>
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

