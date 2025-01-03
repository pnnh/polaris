'use client'

import {useState} from "react";
import './qrcode.scss'
import QRCode from 'qrcode'

export function QRCodeComponent({lang}: { lang: string }) {
    const [text, setText] = useState('')
    const [downloadUrl, setDownloadUrl] = useState('')
    const [error, setError] = useState('')
    return <div className={'qrCodeComponent'}>
        <div className={'textContainer'}>
                <textarea value={text}
                          onChange={(event) => setText(event.target.value)}
                          maxLength={1024}
                          placeholder={'请输入文本内容'}></textarea>
        </div>
        <div className={'actionContainer'}>
            <button onClick={() => {
                if (!text) {
                    setError('qrcode.emptyText')
                    return
                }
                try {
                    setError('')
                    textToQRCode(text).then(downloadUrl => {
                        setDownloadUrl(downloadUrl)
                    })
                } catch (e) {
                    setError(`${'qrcode.errorTip'}${e}`)
                }
            }}>
                {'点击生成'}
            </button>
        </div>
        <div className={'errorContainer'}>
            {error && <div>{error}</div>}
        </div>
        <div className={'resultContainer'}>
            {
                downloadUrl && <img alt={'preview'} src={downloadUrl}/>
            }
        </div>
    </div>
}

export async function textToQRCode(text: string) {
    return await QRCode.toDataURL(text, {
        width: 640,
        margin: 1
    })
}
