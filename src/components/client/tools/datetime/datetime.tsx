'use client'

import React from 'react'
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

        <style jsx>{`
            .datetimeComponent {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                margin: 0 auto;
                min-height: 100vh;
                color: #333;
                width: 100%;
            }

            @media (min-width: 64em) {
                .datetimeComponent {
                    width: 56rem !important;
                }
            }

            .pageTitle {
                font-size: 1.5rem;
                font-weight: bold;
                margin-bottom: 1rem;
            }

            .timestampTable {
                width: 100%;
                margin-bottom: 1rem;
                padding: 0;
                display: table;
                border-top: 0.25px solid #f0f0f0;
                border-left: 0.25px solid #f0f0f0;
            }

            .tableRow {
                padding: 0;
                text-align: left;
                display: table-row;
            }

            .rowLabel {
                font-size: 1.1rem;
                font-weight: bolder;
                width: 10rem;
                display: table-cell;
                align-items: center;
                padding: 0.5rem;
                border-right: 0.25px solid #f0f0f0;
                border-bottom: 0.25px solid #f0f0f0;
            }

            .tableCell {
                padding: 0.5rem;
                display: table-cell;
                border-right: 0.25px solid #f0f0f0;
                border-bottom: 0.25px solid #f0f0f0;
                vertical-align: middle;
            }
        `}</style>
    </div>
}
