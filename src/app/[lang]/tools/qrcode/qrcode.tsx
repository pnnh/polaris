'use client'

import {useState} from "react";
import {textToQRCode} from "@/utils/qrcode";
import {css} from "@/gen/styled/css";

export function QRCodeComponent({lang}: { lang: string }) {
    const [text, setText] = useState('')
    const [downloadUrl, setDownloadUrl] = useState('')
    const [error, setError] = useState('')
    return <div className={qrCodeStyles.qrCodeComponent}>
        <div className={qrCodeStyles.textContainer}>
            <textarea className={qrCodeStyles.textareaStyle} value={text}
                      onChange={(event: any) => setText(event.target.value)}
                      maxLength={1024}
                      placeholder={'请输入文本内容'}></textarea>
        </div>
        <div className={qrCodeStyles.actionContainer}>
            <button className={qrCodeStyles.buttonStyle} onClick={() => {
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
        <div className={qrCodeStyles.errorContainerStyle}>
            {error && <div>{error}</div>}
        </div>
        <div className={qrCodeStyles.resultContainerStyle}>
            {
                downloadUrl && <img className={qrCodeStyles.imgStyle} alt={'preview'} src={downloadUrl}/>
            }
        </div>
    </div>
}

const qrCodeStyles = {
    qrCodeComponent: css`
        margin-bottom: 1rem;
    `,
    description: css`
        font-size: 1rem;
        color: #4a4a4a;
        margin-top: 1rem;
        margin-bottom: 1rem;
    `,
    textContainer: css`
        margin-top: 1rem;
        margin-bottom: 1rem;
    `,
    textareaStyle: css`
        width: calc(100% - 2rem);
        height: 100px;
        padding: 1rem;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-sizing: border-box;
    `,
    actionContainer: css`
        margin: 1rem 0;
    `,
    buttonStyle: css`
        padding: 0.5rem 1rem;
        font-size: 1rem;
        font-weight: 600;
        border: 0;
        border-radius: 5px;
        cursor: pointer;
        background-color: #127af8;
        color: #fff;
    `,
    errorContainerStyle: css`
        padding: 0 1rem;
        color: red;
        font-size: 1rem;
        font-style: italic;
    `,
    resultContainerStyle: css`
        display: flex;
        justify-content: center;
        align-items: center;
    `,
    imgStyle: css`
        width: 40%;
        aspect-ratio: 1 / 1;
        object-fit: contain;
    `
}
