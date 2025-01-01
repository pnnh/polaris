'use client'

import './edit.scss'
import {FormEvent, useState} from "react";
import {validateEmail} from "@/atom/common/utils/email";
import {submitComment} from "@/services/client/comments/comment";
import {isValidUrl} from "@/atom/common/utils/uri";

export function EditArea() {
    const [email, setEmail] = useState('')
    const [nickname, setNickname] = useState('')
    const [website, setWebsite] = useState('')
    const [content, setContent] = useState('')
    const [photo, setPhoto] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const submitForm = async () => {
        const validEmail = validateEmail(email)
        if (email && !validEmail) {
            setErrMsg('client.invalidEmail')
            return
        }
        if (website && !isValidUrl(website)) {
            setErrMsg('client.invalidWebsite')
            return
        }
        if (!content) {
            setErrMsg('client.invalidContent')
            return
        }
        const submitResult = await submitComment(email, nickname, website, photo, content)
        console.log('submitResult', submitResult)
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
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{'网站'}</div>
                        <div className={'fieldValue'}>
                            <input type={'text'} title={'optional'} placeholder={'可选输入'}
                                   onChange={(e) => setWebsite(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className={'editorRow'}>
                    <textarea placeholder={"输入评论内容"} onChange={(e) => setContent(e.target.value)}/>
                </div>
                <div className={'actionsRow'}>
                    <div className={'submitArea'}>
                        <button onClick={() => submitForm().then()}>发布</button>
                    </div>
                    <div className={'errMsg'}>
                        {errMsg}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function UserPhoto() {
    return <div className={'photoContainer'}>
        <img src={`/default/photo.png`} alt="头像"/>
    </div>
}
