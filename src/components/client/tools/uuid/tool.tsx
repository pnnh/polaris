'use client'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import React, {useState} from 'react'
import {NIL, v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5, v6 as uuidv6, v7 as uuidv7, validate} from 'uuid';

import {dnsNamespace, NormalUUIDItem, oidNamespace, OptionType, urlNamespace, x500Namespace} from "./state";
import {copyToClipboard} from "@pnnh/atom/browser";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import {localText} from "@pnnh/atom";
import {transText} from "@/components/common/locales/normal";
import {PSFileModel} from "@/components/common/models/file";

function generateUUID(version: number, options?: {
    type: OptionType
    namespace: string
    name: string
}): NormalUUIDItem {
    if (version === 1) {
        return {
            version: 1,
            long: uuidv1(),
            short: uuidv1().replace(/-/g, '')
        }
    }
    if (version === 3 && options) {
        const value = uuidv3(options.name, options.namespace)
        return {
            version: 3,
            long: value,
            short: value.replace(/-/g, ''),
            options
        }
    }
    if (version === 4) {
        return {
            version: 4,
            long: uuidv4(),
            short: uuidv4().replace(/-/g, '')
        }
    }
    if (version === 5 && options) {
        const value = uuidv5(options.name, options.namespace)
        return {
            version: 5,
            long: value,
            short: value.replace(/-/g, ''),
            options
        }
    }
    if (version === 6) {
        return {
            version: 6,
            long: uuidv6(),
            short: uuidv6().replace(/-/g, '')
        }
    }
    if (version === 7) {
        return {
            version: 7,
            long: uuidv7(),
            short: uuidv7().replace(/-/g, '')
        }
    }
    return {
        version: 0,
        long: NIL,
        short: NIL.replace(/-/g, '')
    }
}

export function UuidToolBody({lang, appInfo}: { lang: string, appInfo: PSFileModel }) {
    const [state, setState] = useState<NormalUUIDItem | undefined>()
    const [history, setHistory] = useState<NormalUUIDItem[]>([])


    const appendHistory = (newItem: NormalUUIDItem) => {
        setHistory((old) => {
            const newList = [newItem, ...old]
            if (newList.length >= 10) {
                newList.pop()
            }
            return newList
        })
    }
    return <div className={'toolComponent'}>
        <div className={'toolBody'}>
            <div className={'titleContainer'}>
                <h1 className={'toolTitle'}>
                    {appInfo.name}
                </h1>
            </div>
            <p className={'toolDescription'}>{appInfo.description}</p>

            <div className={'actionRow'}>
                <div className={'w-24 inline-block font-bold'}>
                    {transText(lang, '版本选择', 'Version Selection')}
                </div>
                <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                    setState(generateUUID(0))
                }}>NIL
                </Button>
                <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                    const newItem = generateUUID(1)
                    setState(newItem)
                    appendHistory(newItem)
                }}>v1
                </Button>
                <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                    const newItem = generateUUID(3, {type: OptionType.Random, namespace: uuidv4(), name: ''})
                    setState(newItem)
                    appendHistory(newItem)
                }}>v3
                </Button>
                <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                    const newItem = generateUUID(4)
                    setState(newItem)
                    appendHistory(newItem)
                }}>v4
                </Button>
                <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                    const newItem = generateUUID(5, {type: OptionType.Random, namespace: uuidv4(), name: ''})
                    setState(newItem)
                    appendHistory(newItem)
                }}>v5
                </Button>
                <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                    const newItem = generateUUID(6)
                    setState(newItem)
                    appendHistory(newItem)
                }}>v6
                </Button>
                <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                    const newItem = generateUUID(7)
                    setState(newItem)
                    appendHistory(newItem)
                }}>v7
                </Button>
            </div>
            {(state?.version === 3 || state?.version === 5) &&
                <GenOptionTable lang={lang} state={state} setState={setState}
                                history={history} setHistory={setHistory}/>}
        </div>
        {state && <UUIDItemCard uuidItem={state} lang={lang}/>}
        {state && <GenHistoryTable lang={lang} history={history}/>}

        <style jsx>{`
            .toolComponent {
                width: 100%;
            }

            .toolBody {
                width: 100%;
                background: #ffffff;
                border-radius: 8px;
                overflow-y: auto;
                margin: 16px auto 0;
            }

            .titleContainer {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
                align-items: center;
                justify-content: space-between;
                margin-top: 16px;
                margin-bottom: 16px;
                padding-right: 16px;
            }

            .toolTitle {
                margin: 0.5rem 1rem;
            }

            .toolDescription {
                margin: 8px 16px 16px;
                font-size: 16px;
                color: #666666;
            }

            .tip {
                margin-top: 8px;
                margin-left: 16px;
                margin-right: 16px;
                font-size: 14px;
                color: #666666;
            }

            .actionRow {
                margin: 2rem 16px;
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }

            .optionRow {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
                margin-left: 16px;
                margin-right: 16px;
                margin-bottom: 16px;
                font-size: 0.95rem;
                color: #666666;
                align-items: center;
            }

            .namespaceForm {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                justify-content: center;
            }

            .namespaceSwitch {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
                align-items: center;
            }

            .namespaceText {
                display: flex;
                flex-direction: row;
                gap: 16px;
                align-items: center;
            }
        `}</style>
    </div>
}

function GenOptionTable({lang, state, setState, history, setHistory}:
                        {
                            lang: string,
                            state: NormalUUIDItem | undefined,
                            setState: (item: NormalUUIDItem) => void,
                            history: NormalUUIDItem[],
                            setHistory: (items: NormalUUIDItem[]) => void
                        }) {
    if (!state || !state.options || (state.version !== 3 && state.version !== 5)) {
        return <></>
    }
    const validateNamespace = validate(state.options.namespace)
    const appendHistory = (newItem: NormalUUIDItem) => {

        const newList = [newItem, ...history]
        if (newList.length >= 10) {
            newList.pop()
        }
        setHistory(newList)
    }
    return <>
        <div className={'optionRow'}>
            <div className={'w-24 inline-block'}>
                {transText(lang, '命名空间', 'Namespace')}
            </div>
            <div className={'namespaceForm'}>
                <div className={'namespaceSwitch'}>
                    <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.Random,
                            namespace: uuidv4(),
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>
                        {transText(lang, '随机', 'Random')}
                    </Button>
                    <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.DNS, namespace: dnsNamespace,
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>DNS
                    </Button>
                    <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.URL, namespace: urlNamespace,
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>URL
                    </Button>
                    <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.OID, namespace: oidNamespace,
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>OID
                    </Button>
                    <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.X500, namespace: x500Namespace,
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>X500
                    </Button>
                    <Button variant={'contained'} size={'small'} lang={lang} onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.Custom, namespace: state?.options?.namespace || uuidv4(),
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>{transText(lang, '自定义', 'Custom')}</Button>
                </div>
                <div className={'namespaceText'}>
                    <div>
                        <div>
                            <TextField
                                size={'small'}
                                disabled={state?.options?.type !== OptionType.Custom}
                                placeholder={transText(lang, '命名空间', 'Namespace')}
                                value={state?.options?.namespace || ''}
                                onChange={(event) => {
                                    const valid = validate(event.target.value)
                                    if (!valid) {
                                        setState({
                                            ...state,
                                            options: {
                                                ...state.options!,
                                                namespace: event.target.value
                                            }
                                        })
                                        return
                                    }
                                    const newItem = generateUUID(state?.version, {
                                        type: OptionType.Custom,
                                        namespace: event.target.value,
                                        name: state?.options?.name || ''
                                    })
                                    setState(newItem)
                                    appendHistory(newItem)
                                }}
                            />
                        </div>
                    </div>
                    <div title={'tool.options.helpText'}>
                        <QuestionMarkIcon fontSize={'small'}/>
                    </div>
                </div>
            </div>
        </div>
        <div className={'optionRow'}>
            <div className={'w-24 inline-block'}>{localText(lang, '名称', 'Name')}</div>
            <div>
                <TextField
                    size={'small'}
                    placeholder={localText(lang, '名称', 'Name')}
                    value={state?.options?.name || ''}
                    onChange={(event) => {
                        const newItem = generateUUID(state?.version, {
                            type: state?.options?.type || OptionType.Random,
                            namespace: state?.options?.namespace || uuidv4(),
                            name: event.target.value || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}
                />
            </div>
        </div>
    </>
}

function GenHistoryTable({lang, history}: { lang: string, history: NormalUUIDItem[] }) {
    return <div>
        <h2>{localText(lang, '生成历史', 'History')}</h2>
        {history.map((item, index) => {
            return <div key={index}>
                <UUIDItemCard uuidItem={item} lang={lang}/>
            </div>
        })}
    </div>
}

function UUIDItemCard({uuidItem, lang}: { uuidItem: NormalUUIDItem, lang: string }) {

    return <div className={'uuidItemCard'}>
        <div className={'dataRow'}>
            <div className={'headerCell'}>{localText(lang, '长格式', 'Long Format')}</div>
            <div className={'dataCell'}>
                <div className={'uuidItem'}>
                    <CopyItem uuidText={uuidItem.long.toUpperCase()}/>
                </div>
                <div className={'uuidItem'}>
                    <CopyItem uuidText={uuidItem.long.toLowerCase()}/>
                </div>
            </div>
        </div>
        <div className={'dataRow'}>
            <div className={'headerCell'}>{localText(lang, '短格式', 'Short Format')}</div>
            <div className={'dataCell'}>
                <div className={'uuidItem'}>
                    <CopyItem uuidText={uuidItem.short.toUpperCase()}/>
                </div>
                <div className={'uuidItem'}>
                    <CopyItem uuidText={uuidItem.short.toLowerCase()}/>
                </div>
            </div>
        </div>
        {(uuidItem.version === 3 || uuidItem.version === 5) && <div className={'dataRow'}>
            <div className={'headerCell'}>{localText(lang, '生成选项', 'Options')}</div>
            <div className={'dataCell'}>
                {uuidItem.options && <div>
                    <div>{JSON.stringify(uuidItem.options)}</div>
                </div>}
            </div>
        </div>}

        <style jsx>{`
            .uuidItemCard {
                display: table;
                width: 100%;
                border-collapse: collapse;
                border-spacing: 0;
                margin-top: 16px;
                margin-bottom: 16px;
                font-size: 1rem;
                background: #ffffff;
                border-radius: 4px;
                padding: 1rem;
            }

            .headerRow, .dataRow {
                display: table-row;
                width: 100%;
                border-bottom: 1px solid #f3f3f3;
            }

            .headerCell {
                display: table-cell;
                font-size: 0.9rem;
                vertical-align: middle;
                width: 6rem;
                padding: 8px;
            }

            .dataCell {
                display: table-cell;
                padding: 8px;
                font-size: 0.9rem;
            }

            .uuidItem {
                color: #666666;
            }

            .uuidItem:first-of-type {
                margin-bottom: 0.5rem;
            }

            .dataCell:first-of-type {
                font-weight: bold;
                vertical-align: middle;
                text-align: left;
            }
        `}</style>
    </div>
}

function CopyItem({uuidText}: { uuidText: string }) {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    if (!uuidText) {
        return <></>
    }
    return <div className={'styleCopyItem'}>
        <div title={message}>
            <div onClick={() => {
                copyToClipboard(uuidText).then(() => {
                    setMessage('success')
                }).catch(() => {
                    setMessage('failed')
                })
                setOpen(true)
                setTimeout(() => {
                    setOpen(false)
                }, 3000)
            }}>
                <ContentCopyIcon fontSize={'small'}/>
            </div>
        </div>
        <span>{uuidText}</span>

        <style jsx>{`
            .styleCopyItem {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
                align-items: center;
            }

            .styleCopyItem :global(svg) {
                cursor: pointer;
                margin-bottom: 0 !important;
            }

            .styleCopyItem :global(svg:hover) {
                color: #666666;
            }

            .styleCopyItem :global(span) {
                margin-bottom: 0 !important;
            }
        `}</style>
    </div>
}
