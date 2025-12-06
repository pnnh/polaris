'use client'

import {useState} from "react";
import {textToQRCode} from "@/utils/qrcode";

export function QRCodeComponent({lang}: { lang: string }) {
    const [text, setText] = useState('')
    const [downloadUrl, setDownloadUrl] = useState('')
    const [error, setError] = useState('')
    return <div className={'qrCodeComponent'}>
        <style jsx>{`
            .qrCodeComponent {
                margin-bottom: 1rem;
            }

            .description {
                font-size: 1rem;
                color: #4a4a4a;
                margin-top: 1rem;
                margin-bottom: 1rem;
            }

            .textContainer {
                margin-top: 1rem;
                margin-bottom: 1rem;
            }

            .textareaStyle {
                width: calc(100% - 2rem);
                height: 100px;
                padding: 1rem;
                font-size: 1rem;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-sizing: border-box;
                /* resize: none; */
            }

            .actionContainer {
                margin: 1rem 0;
            }

            .buttonStyle {
                padding: 0.5rem 1rem;
                font-size: 1rem;
                font-weight: 600;
                border: 0;
                border-radius: 5px;
                cursor: pointer;
                background-color: #127af8;
                color: #fff;
            }

            .errorContainerStyle {
                padding: 0 1rem;
                color: red;
                font-size: 1rem;
                font-style: italic;
            }

            .resultContainerStyle {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .imgStyle {
                width: 40%;
                aspect-ratio: 1 / 1;
                object-fit: contain;
            }
        `}</style>
        <div className={'textContainer'}>
            <textarea className={'textareaStyle'} value={text}
                      onChange={(event: any) => setText(event.target.value)}
                      maxLength={1024}
                      placeholder={'请输入文本内容'}></textarea>
        </div>
        <div className={'actionContainer'}>
            <button className={'buttonStyle'} onClick={() => {
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
        <div className={'errorContainerStyle'}>
            {error && <div>{error}</div>}
        </div>
        <div className={'resultContainerStyle'}>
            {
                downloadUrl && <img className={'imgStyle'} alt={'preview'} src={downloadUrl}/>
            }
        </div>
    </div>
}
