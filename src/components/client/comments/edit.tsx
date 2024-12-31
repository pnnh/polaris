'use client'

import './edit.scss'
import {FormEvent, useState} from "react";
import {useClientTranslation} from "@/services/client/i18n/client";
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

    const {t} = useClientTranslation(lang || 'zh')
    const submitForm = async () => {
        const validEmail = validateEmail(email)
        if (email && !validEmail) {
            setErrMsg(t('client.invalidEmail'))
            return
        }
        if (website && !isValidUrl(website)) {
            setErrMsg(t('client.invalidWebsite'))
            return
        }
        if (!content) {
            setErrMsg(t('client.invalidContent'))
            return
        }
        const submitResult = await submitComment(email, nickname, website, photo, content)
        console.log('submitResult', submitResult)
    }

    return <div className={'editContainer'}>
        <div className={'areaTitle'}>
            {t('client.title')}
        </div>
        <div className={'editRow'}>
            <UserPhoto assetsUrl={assetsUrl}/>
            <div className={'infoColumn'}>
                <div className={'fieldsRow'}>
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{t('nickname')}</div>
                        <div className={'fieldValue'}>
                            <input type={'text'} title={t('optional')} placeholder={t('nickname')}
                                   onChange={(e) => setNickname(e.target.value)}/>
                        </div>
                    </div>
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{t('email')}</div>
                        <div className={'fieldValue'}>
                            <input type={'email'} title={t('optional')} placeholder={t('email')}
                                   onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                    </div>
                    <div className={'infoField'}>
                        <div className={'fieldKey'}>{t('website')}</div>
                        <div className={'fieldValue'}>
                            <input type={'text'} title={t('optional')} placeholder={t('website')}
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
