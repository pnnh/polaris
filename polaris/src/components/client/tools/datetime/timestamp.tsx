'use client'

import React from "react";
import {transKey} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

enum Tab {
    GenTimestamp,
    TimestampToDatetime,
    DatetimeToTimestamp,
}

export function TimestampHelper({lang}: { lang: string }) {
    const [tab, setTab] = React.useState<Tab>(Tab.GenTimestamp)
    return <div className={timestampStyles.timestampHelper}>
        <div className={timestampStyles.helperContainer}>
            <div className={timestampStyles.tabContainer}>
                <div className={`${timestampStyles.tabItem} ${tab === Tab.GenTimestamp ? timestampStyles.active : ''}`}
                     onClick={() => setTab(Tab.GenTimestamp)}>
                    {transKey(lang, 'timestamp.tab.genTimestamp')}
                </div>
                <div
                    className={`${timestampStyles.tabItem} ${tab === Tab.TimestampToDatetime ? timestampStyles.active : ''}`}
                    onClick={() => setTab(Tab.TimestampToDatetime)}>
                    {transKey(lang, "timestamp.tab.timestampToDatetime")}
                </div>
                <div
                    className={`${timestampStyles.tabItem} ${tab === Tab.DatetimeToTimestamp ? timestampStyles.active : ''}`}
                    onClick={() => setTab(Tab.DatetimeToTimestamp)}>
                    {transKey(lang, "timestamp.tab.datetimeToTimestamp")}
                </div>
            </div>
            <div className={timestampStyles.bodyContainer}>
                {
                    tab === Tab.GenTimestamp && <GenTimestamp/>
                }
                {
                    tab === Tab.TimestampToDatetime && <TimestampToDatetime/>
                }
                {
                    tab === Tab.DatetimeToTimestamp && <DatetimeToTimestamp/>
                }
            </div>
        </div>
    </div>
}

function GenTimestamp() {
    return <div className={timestampStyles.helpTable}>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Java
            </div>
            <div className={timestampStyles.tableCell}>time
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>JavaScript
            </div>
            <div className={timestampStyles.tableCell}>
                <code>
                    Math.round(new Date().getTime()/1000)<br/>
                    <span>getTime()</span>
                </code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Microsoft .NET / C#
            </div>
            <div className={timestampStyles.tableCell}>epoch = (DateTime.Now.ToUniversalTime().Ticks -
                621355968000000000) /
                10000000
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>MySQL
            </div>
            <div className={timestampStyles.tableCell}>SELECT unix_timestamp(now())
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Perl
            </div>
            <div className={timestampStyles.tableCell}>time
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>PHP
            </div>
            <div className={timestampStyles.tableCell}>time()
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>PostgreSQL
            </div>
            <div className={timestampStyles.tableCell}>SELECT extract(epoch FROM now())
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Python
            </div>
            <div className={timestampStyles.tableCell}>import time<br/>time.time()
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Ruby
            </div>
            <div className={timestampStyles.tableCell}>
                Time.now.to_i
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Go
            </div>
            <div className={timestampStyles.tableCell}>import time<br/>int32(time.Now().Unix())
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>SQL Server
            </div>
            <div className={timestampStyles.tableCell}>SELECT DATEDIFF(s, '1970-01-01 00:00:00', GETUTCDATE())
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Unix / Linux
            </div>
            <div className={timestampStyles.tableCell}>date +%s
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>VBScript / ASP
            </div>
            <div className={timestampStyles.tableCell}>DateDiff("s", "01/01/1970 00:00:00", Now())
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>
                Perl
            </div>
            <div className={timestampStyles.tableCell}>perl -e "print time"
            </div>
        </div>
    </div>
}

function TimestampToDatetime() {
    return <div className={timestampStyles.helpTable}>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Java
            </div>
            <div className={timestampStyles.tableCell}><code>String date = new java.text.SimpleDateFormat("dd/MM/yyyy
                HH:mm:ss").format(new java.util.Date(Unix timestamp * 1000))</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>JavaScript
            </div>
            <div className={timestampStyles.tableCell}><code>var unixTimestamp = new Date(Unix timestamp *
                1000)<br/>commonTime = unixTimestamp.toLocaleString()</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Linux
            </div>
            <div className={timestampStyles.tableCell}><code>date -d @Unix timestamp</code></div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>MySQL
            </div>
            <div className={timestampStyles.tableCell}><code>from_unixtime(Unix timestamp)</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Perl
            </div>
            <div className={timestampStyles.tableCell}><code>my $time = Unix timestamp <br/> my
                ($sec, $min, $hour, $day, $month, $year) = (localtime($time))[0,1,2,3,4,5,6]
            </code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>PHP
            </div>
            <div className={timestampStyles.tableCell}><code>date('r', Unix timestamp)</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>PostgreSQL
            </div>
            <div className={timestampStyles.tableCell}><code>SELECT TIMESTAMP WITH TIME ZONE 'epoch' + Unix timestamp) *
                INTERVAL '1 second';</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Python
            </div>
            <div className={timestampStyles.tableCell}><code>import time <br/> time.gmtime(Unix
                timestamp)</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Ruby
            </div>
            <div className={timestampStyles.tableCell}><code>Time.at(Unix timestamp)</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>SQL Server
            </div>
            <div className={timestampStyles.tableCell}><code>DATEADD(s, Unix timestamp, '1970-01-01 00:00:00')</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>VBScript / ASP
            </div>
            <div className={timestampStyles.tableCell}><code>DateAdd("s", Unix timestamp, "01/01/1970 00:00:00")</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>
                Perl
            </div>
            <div className={timestampStyles.tableCell}>
                <code>perl -e "print scalar(localtime(Unix
                    timestamp))"</code>
            </div>
        </div>
    </div>
}

function DatetimeToTimestamp() {
    return <div className={timestampStyles.helpTable}>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Java
            </div>
            <div className={timestampStyles.tableCell}><code>long epoch = new java.text.SimpleDateFormat("dd/MM/yyyy
                HH:mm:ss").parse("01/01/1970 01:00:00");</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>JavaScript
            </div>
            <div className={timestampStyles.tableCell}><code>var commonTime = new Date(Date.UTC(year, month - 1, day,
                hour, minute, second))</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>MySQL
            </div>
            <div className={timestampStyles.tableCell}><code>
                SELECT unix_timestamp(time)</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Perl
            </div>
            <div className={timestampStyles.tableCell}><code>use Time::Local <br/> my $time =
                timelocal($sec, $min, $hour, $day, $month, $year);</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>PHP
            </div>
            <div className={timestampStyles.tableCell}><code>mktime(hour, minute, second, month,
                day, year)</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>PostgreSQL
            </div>
            <div className={timestampStyles.tableCell}><code>SELECT extract(epoch FROM date('YYYY-MM-DD
                HH:MM:SS'));</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Python
            </div>
            <div className={timestampStyles.tableCell}><code>import time<br/>
                int(time.mktime(time.strptime('YYYY-MM-DD HH:MM:SS', '%Y-%m-%d %H:%M:%S')))</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Ruby
            </div>
            <div className={timestampStyles.tableCell}><code>Time.local(year, month, day, hour, minute,
                second)</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>SQL Server
            </div>
            <div className={timestampStyles.tableCell}><code>SELECT DATEDIFF(s, '1970-01-01 00:00:00', time)</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>Unix / Linux
            </div>
            <div className={timestampStyles.tableCell}><code>date +%s -d"Jan 1, 1970 00:00:01"</code>
            </div>
        </div>
        <div className={timestampStyles.tableRow}>
            <div className={timestampStyles.tableLabel}>VBScript / ASP
            </div>
            <div className={timestampStyles.tableCell}><code>DateDiff("s", "01/01/1970 00:00:00", time)</code>
            </div>
        </div>
    </div>
}

const timestampStyles = {
    timestampHelper: css`
        width: 100%;
    `,
    helperContainer: css`
        width: 100%;
        margin-bottom: 2rem;
    `,
    tabContainer: css`
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 1rem;
    `,
    tabItem: css`
        padding: 0.5rem;
        border-bottom: none;
        cursor: pointer;
    `,
    active: css`
        border-bottom: 2px solid #333;
    `,
    bodyContainer: css``,
    helpTable: css`
        width: 100%;
        padding: 0;
        display: table;
        border-top: 0.5px solid #f0f0f0;
        border-left: 0.5px solid #f0f0f0;
        border-right: 0.5px solid #f0f0f0;
    `,
    tableRow: css`
        padding: 0;
        text-align: left;
        display: table-row;
    `,
    tableLabel: css`
        font-weight: normal;
        font-size: 0.9rem;
        display: table-cell;
        width: 10rem;
        background-color: #fafafa;
        border-bottom: 0.5px solid #f0f0f0;
        border-right: 0.5px solid #f0f0f0;
        padding: 0.5rem;
    `,
    tableCell: css`
        padding: 0.5rem;
        display: table-cell;
        border-bottom: 0.5px solid #f0f0f0;
        font-size: 0.9rem;
        color: #333;
    `
}

