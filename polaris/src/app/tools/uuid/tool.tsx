'use client'

import React, {useState} from 'react'
import './tool.scss'
import {
    NIL, v1 as uuidv1, v3 as uuidv3, v4 as uuidv4, v5 as uuidv5,
    v6 as uuidv6, v7 as uuidv7, validate
} from 'uuid';

import {copyToClipboard} from "@/utils/clipboard";
import {
    dnsNamespace,
    NormalUUIDItem,
    oidNamespace,
    OptionType,
    urlNamespace,
    x500Namespace
} from "./state";
import {useTranslation} from "next-i18next";
import {useClientTranslation} from "@/services/client/i18n/client";

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

export function ToolBody({lang}: { lang: string }) {
    const [state, setState] = useState<NormalUUIDItem|undefined>()
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
    const {t} = useClientTranslation(lang)
    return <div className={'toolComponent'}>
        <div className={'toolBody'}>
            <div className={'titleContainer'}>
                <h1 className={'toolTitle'}>
                    {t('product.name')}
                </h1>
            </div>
            <p className={'toolDescription'}>{t('product.description')}</p>
            <p className={'tip'}>{t('tool.tips')}</p>

            <div className={'actionRow'}>
                <div className={'w-24 inline-block font-bold'}>{t('tool.uuidVersion')}</div>
                <button onClick={() => {
                            setState(generateUUID(0))
                        }}>NIL</button>
                <button onClick={() => {
                            const newItem = generateUUID(1)
                            setState(newItem)
                            appendHistory(newItem)
                        }}>v1</button>
                <button onClick={() => {
                            const newItem = generateUUID(3, {type: OptionType.Random, namespace: uuidv4(), name: ''})
                            setState(newItem)
                            appendHistory(newItem)
                        }}>v3</button>
                <button onClick={() => {
                            const newItem = generateUUID(4)
                            setState(newItem)
                            appendHistory(newItem)
                        }}>v4</button>
                <button onClick={() => {
                            const newItem = generateUUID(5, {type: OptionType.Random, namespace: uuidv4(), name: ''})
                            setState(newItem)
                            appendHistory(newItem)
                        }}>v5</button>
                <button onClick={() => {
                            const newItem = generateUUID(6)
                            setState(newItem)
                            appendHistory(newItem)
                        }}>v6</button>
                <button onClick={() => {
                            const newItem = generateUUID(7)
                            setState(newItem)
                            appendHistory(newItem)
                        }}>v7</button>
            </div>
            {(state?.version === 3 || state?.version === 5) &&
                <GenOptionTable lang={lang} state={state} setState={setState}
                    history={history} setHistory={setHistory}/>}
        </div>
        {state && <UUIDItemCard uuidItem={state} lang={lang}/>}
        {state && <GenHistoryTable lang={lang} history={history}/>}
    </div>
}

function GenOptionTable({lang, state, setState, history, setHistory}:
                        { lang: string,
                          state: NormalUUIDItem|undefined,
                          setState: (item: NormalUUIDItem) => void,
                            history: NormalUUIDItem[],
                          setHistory: (items: NormalUUIDItem[]) => void }) {
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
    const {i18n} = useTranslation(lang)
    const t = i18n.getFixedT(lang)

    return <>
        <div className={'optionRow'}>
            <div className={'w-24 inline-block'}>{t('tool.options.namespace')}</div>
            <div className={'namespaceForm'}>
                <div className={'namespaceSwitch'}>
                    <button onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.Random,
                            namespace: uuidv4(),
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>{t('tool.type.random')}</button>
                    <button onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.DNS, namespace: dnsNamespace,
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>DNS</button>
                    <button onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.URL, namespace: urlNamespace,
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>URL</button>
                    <button onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.OID, namespace: oidNamespace,
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>OID</button>
                    <button onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.X500, namespace: x500Namespace,
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>X500</button>
                    <button onClick={() => {
                        const newItem = generateUUID(state.version, {
                            type: OptionType.Custom, namespace: state?.options?.namespace || uuidv4(),
                            name: state?.options?.name || ''
                        })
                        setState(newItem)
                        appendHistory(newItem)
                    }}>{t('tool.type.custom')}</button>
                </div>
                <div className={'namespaceText'}>
                    <div >
                        <div>
                            <input
                                disabled={state?.options?.type !== OptionType.Custom}
                                placeholder={t('tool.options.namespace')}
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
                    <div title={t('tool.options.helpText')}>
                        ?
                    </div>
                </div>
            </div>
        </div>
        <div className={'optionRow'}>
            <div className={'w-24 inline-block'}>{t('tool.options.name')}</div>
            <div>
                <input
                    placeholder={t('tool.options.name')}
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

    const {i18n} = useTranslation(lang)
    const t = i18n.getFixedT(lang)
    return <div>
        <h2>{t('tool.history.title')}</h2>
        {history.map((item, index) => {
            return <div key={index}>
                <UUIDItemCard uuidItem={item} lang={lang}/>
            </div>
        })}
    </div>
}

function UUIDItemCard({uuidItem, lang}: { uuidItem: NormalUUIDItem, lang: string }) {
    const {i18n} = useTranslation(lang)
    const t = i18n.getFixedT(lang)
    return <div className={'uuidItemCard'}>
        <div className={'dataRow'}>
            <div className={'headerCell'}>{t('tool.format.long')}</div>
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
            <div className={'headerCell'}>{t('tool.format.short')}</div>
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
            <div className={'headerCell'}>{t('tool.format.options')}</div>
            <div className={'dataCell'}>
                {uuidItem.options && <div>
                    <div>{JSON.stringify(uuidItem.options)}</div>
                </div>}
            </div>
        </div>}
    </div>
}

function CopyItem({uuidText}: { uuidText: string }) {
    const [message, setMessage] = useState('')
    const [open, setOpen] = useState(false)
    if (!uuidText) {
        return <></>
    }
    return <div className={'styleCopyItem'}>
        <div title={message} >
            <div  onClick={() => {
                copyToClipboard(uuidText).then(() => {
                    setMessage('success')
                }).catch(() => {
                    setMessage('failed')
                })
                setOpen(true)
                setTimeout(() => {
                    setOpen(false)
                }, 3000)
            }}/>
        </div>
        <span>{uuidText}</span>
    </div>
}
