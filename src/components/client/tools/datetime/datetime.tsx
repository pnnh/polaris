'use client'

import React from 'react'
import './datetime.scss'
import {TimestampHelper} from "@/components/client/tools/datetime/timestamp";

export default function DatetimeComponent({lang}: { lang: string }) {
    const now = new Date()
    const timestamp = Math.floor(now.getTime() / 1000)
    return <div className={"datetimeComponent"}>
        <h1 className={"pageTitle"}>{"datetime.page.title"}</h1>
        <div className={"timestampTable"}>
            <div className={"tableRow"}>
                <div className={"rowLabel"}>{"datetime.page.currentTimestamp"}
                </div>
                <div className={"tableCell"}>{timestamp}</div>
            </div>
            <div className={"tableRow"}>
                <div className={"rowLabel"}>{"datetime.page.currentDatetime"}
                </div>
                <div className={"tableCell"}>{now.toLocaleString()}</div>
            </div>
        </div>
        <TimestampHelper lang={lang}/>
    </div>
}
