'use client'

import React, {useState} from "react"
import JsBarcode from "jsbarcode";
import './barcode.scss'

export function BarCodeComponent({lang}: { lang: string }) {
    const [text, setText] = useState('')
    const [error, setError] = useState('')
    return <div className={'barCodeComponent'}>
        <div className={'textContainer'}>
                <textarea value={text}
                          maxLength={2048}
                          onChange={(event) => setText(event.target.value)}></textarea>
        </div>
        <div className={'actionContainer'}>
            <button onClick={() => {
                if (!text) {
                    setError('barcode.emptyText')
                    return
                }
                try {
                    setError('')
                    textToBarCode('#resultContainer', text)
                } catch (e) {
                    setError(`${'barcode.errorTip'}${e}`)
                }
            }}>
                {'barcode.generate'}
            </button>
        </div>
        <div className={'errorContainer'}>
            {error && <div>{error}</div>}
        </div>
        <div className={'resultContainer'}>
            <svg id={'resultContainer'}>
            </svg>
        </div>
    </div>
}
export function textToBarCode(domSelector: string, text: string) {
    JsBarcode(domSelector, text);
}
