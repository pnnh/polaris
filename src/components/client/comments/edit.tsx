'use client'

import './edit.scss'
import {FormEvent, useState} from "react";
import {validateEmail} from "@/atom/common/utils/email";
import {submitComment} from "@/services/client/comments/comment";
import {isValidUrl} from "@/atom/common/utils/uri";

export function EditArea({mode, lang, assetsUrl}: { mode?: string, lang?: string, assetsUrl: string }) {
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
            {'client.title'}
        </div>
        <div className={'editRow'}>
            <UserPhoto assetsUrl={assetsUrl}/>
            <div className={'infoColumn'}>
                <div className={'fieldsRow'}>
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{'nickname'}</div>
                        <div className={'fieldValue'}>
                            <input type={'text'} title={'optional'} placeholder={'nickname'}
                                   onChange={(e) => setNickname(e.target.value)}/>
                        </div>
                    </div>
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{'email'}</div>
                        <div className={'fieldValue'}>
                            <input type={'email'} title={'optional'} placeholder={'email'}
                                   onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                    </div>
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{'website'}</div>
                        <div className={'fieldValue'}>
                            <input type={'text'} title={'optional'} placeholder={'website'}
                                   onChange={(e) => setWebsite(e.target.value)}/>
                        </div>
                    </div>
                </div>
                <div className={'editorRow'}>
                    <textarea placeholder={"输入评论内容"} onChange={(e) => setContent(e.target.value)}/>
                </div>
                <div className={'actionsRow'}>
                    <div className={'emotionArea'}>
                        <button>表情</button>
                        <button>附件</button>
                    </div>
                    <div className={'errMsg'}>
                        {errMsg}
                    </div>
                    <div className={'submitArea'}>
                        <button>预览</button>
                        <button onClick={() => submitForm().then()}>发布</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

function UserPhoto({assetsUrl}: { assetsUrl: string }) {
    return <div className={'photoContainer'}>
        <img src={`${assetsUrl}/public/default/photo.png`} alt="头像"/>
    </div>
}
