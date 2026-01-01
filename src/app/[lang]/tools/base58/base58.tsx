'use client'

import {useState} from "react";
import styles from './base58.module.scss'
import {Button, FormControlLabel, Radio, RadioGroup, Tooltip} from "@mui/material";
import {css} from "@emotion/css";
import {base58ToString, stringToBase58} from "@pnnh/atom";
import {copyToClipboard} from "@pnnh/atom/browser";
import {transExtra, transKey} from "@/components/common/locales/normal";

const resultActionContainer = css({
    margin: '1rem 0 1rem 1rem',
    display: 'flex',
    flexDirection: 'row',
    gap: '0.5rem',
})
const resultTipsStyle = css({
    fontSize: '0.9rem',
    color: '#888',
})
const resultTextStyle = css({
    minHeight: '12rem',
    borderRadius: '4px',
    padding: '1rem',
    fontSize: '1rem',
    width: 'calc(100% - 4rem)',
    border: '1px solid #ccc',
    wordBreak: 'break-all',
})

export function Base58Component({lang}: { lang: string }) {
    const [sourceText, setSourceText] = useState('')
    const [resultText, setResultText] = useState('')
    const [error, setError] = useState('')
    const [open, setOpen] = useState(false)
    const [message, setMessage] = useState<string>('success')
    const [flavor, setFlavor] = useState('default')

    const handleTooltipClose = () => {
        setOpen(false);
    };

    return <div className={styles.base58Component}>
        <h1 className={styles.productTitle}>{transExtra(lang, 'Base58 编码和解码工具', 'Base58 encoding and decoding tool', 'base58Tool')}</h1>
        <div className={styles.textContainer}>
                <textarea name={'base58-source'} value={sourceText}
                          onChange={(event) => setSourceText(event.target.value)}
                          maxLength={4096}
                          placeholder={transExtra(lang, "请输入文本", "Please input text", 'InputPlaceholder')}></textarea>
        </div>
        <div className={styles.flavorContainer}>
            <RadioGroup
                row
                aria-labelledby="base58-flavor-group-label"
                value={flavor}
                onChange={(e) => setFlavor(e.target.value)}
                name="base58-flavor-group">
                <FormControlLabel value="default" control={<Radio size='small'/>} label="default"/>
                <FormControlLabel value="xrp" control={<Radio size='small'/>} label="xrp"/>
                <FormControlLabel value="xmr" control={<Radio size='small'/>} label="xmr"/>
                <FormControlLabel value="flickr" control={<Radio size='small'/>} label="flickr"/>
                <FormControlLabel value="check" control={<Radio size='small'/>} label="check"/>
            </RadioGroup>
        </div>
        <div className={styles.actionContainer}>
            <Button variant={'contained'} size={'small'} onClick={() => {
                if (!sourceText) {
                    setError(transKey(lang, 'InputPlaceholder'))
                    return
                }
                try {
                    setError('')
                    const text = stringToBase58(sourceText, flavor)
                    setResultText(text)
                } catch (e) {
                    setError(transKey(lang, 'ConvertFailed'))
                }
            }}>
                {transKey(lang, 'ConvertButton')}
            </Button>
            <Button variant={'contained'} size={'small'} onClick={() => {
                if (!sourceText) {
                    setError(transKey(lang, 'InputPlaceholder'))
                    return
                }
                try {
                    setError('')
                    const text = base58ToString(sourceText, flavor)
                    setResultText(text)
                } catch (e) {
                    setError(transKey(lang, 'InvalidBase58'))
                }
            }}>
                {transKey(lang, 'DecodeButton')}
            </Button>
            <Button variant={'contained'} size={'small'} onClick={() => {
                setSourceText('')
                setResultText('')
            }}>
                {transKey(lang, 'ClearButton')}
            </Button>
        </div>
        <div className={styles.errorContainer}>
            {error && <div>{error}</div>}
        </div>
        <div className={styles.resultContainer}>
            <div className={resultTextStyle}>
                {resultText || <div className={resultTipsStyle}>
                    {transKey(lang, 'ResultPlaceholder')}
                </div>}
            </div>
        </div>
        <div className={resultActionContainer}>
            <Tooltip title={message} placement="right"
                     onClose={handleTooltipClose}
                     open={open}
                     disableFocusListener
                     disableHoverListener
                     disableTouchListener
                     arrow
                     slotProps={{
                         popper: {
                             modifiers: [
                                 {
                                     name: 'offset',
                                     options: {
                                         offset: [0, -8],
                                     },
                                 },
                             ],
                         },
                     }}>
                <Button variant={'contained'} size={'small'}
                        onClick={() => {
                            if (!resultText) {
                                return
                            }
                            copyToClipboard(resultText).then(() => {
                                setMessage('success')
                            }).catch(() => {
                                setMessage('failed')
                            })
                            setOpen(true)
                            setTimeout(() => {
                                setOpen(false)
                            }, 3000)
                        }}>
                    {transKey(lang, 'CopyButton')}
                </Button>
            </Tooltip>
        </div>
    </div>
}
