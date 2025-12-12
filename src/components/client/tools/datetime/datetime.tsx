'use client'

import React from 'react'
import './datetime.scss'
import {TimestampHelper} from "@/components/client/tools/datetime/timestamp";
import {transKey} from "@/components/common/locales/normal";

export default function DatetimeComponent({lang}: { lang: string }) {
    const [now, setNow] = React.useState<Date | undefined>()
    const [timestamp, setTimestamp] = React.useState<number>(0)

    React.useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date()
            setNow(now)
            setTimestamp(Math.floor(now.getTime() / 1000))
        }, 1000)
        return () => clearInterval(interval)
    }, [])
    return <div className={"datetimeComponent"}>
        <h1 className={"pageTitle"}>{transKey(lang, "datetime.page.title")}</h1>
        <div className={"timestampTable"}>
            <div className={"tableRow"}>
                <div className={"rowLabel"}>{transKey(lang, "datetime.page.currentDatetime")}
                </div>
                <div className={"tableCell"}>{now?.toLocaleString()}</div>
            </div>
            <div className={"tableRow"}>
                <div className={"rowLabel"}>{transKey(lang, "datetime.page.currentTimestamp")}
                </div>
                <div className={"tableCell"}>{timestamp}</div>
            </div>
        </div>
        <TimestampHelper lang={lang}/>
    </div>
}
