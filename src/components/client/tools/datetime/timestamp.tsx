'use client'

import React from "react";
import {transKey} from "@/components/common/locales/normal";

enum Tab {
    GenTimestamp,
    TimestampToDatetime,
    DatetimeToTimestamp,
}

export function TimestampHelper({lang}: { lang: string }) {
    const [tab, setTab] = React.useState<Tab>(Tab.GenTimestamp)
    return <div className={'timestampHelper'}>
        <div className={"helperContainer"}>
            <div className={
                "tabContainer"}>
                <div className={`tabItem ${tab === Tab.GenTimestamp ? 'active' : ''}`}
                     onClick={() => setTab(Tab.GenTimestamp)}>
                    {transKey(lang, 'timestamp.tab.genTimestamp')}
                </div>
                <div className={`tabItem ${tab === Tab.TimestampToDatetime ? 'active' : ''}`}
                     onClick={() => setTab(Tab.TimestampToDatetime)}>
                    {transKey(lang, "timestamp.tab.timestampToDatetime")}
                </div>
                <div className={`tabItem ${tab === Tab.DatetimeToTimestamp ? 'active' : ''}`}
                     onClick={() => setTab(Tab.DatetimeToTimestamp)}>
                    {transKey(lang, "timestamp.tab.datetimeToTimestamp")}
                </div>
            </div>
            <div className={
                "bodyContainer"}>
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

        <style jsx>{`
            .timestampHelper {
                width: 100%;
            }

            .helperContainer {
                width: 100%;
                margin-bottom: 2rem;
            }

            .tabContainer {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                margin-bottom: 1rem;
            }

            .tabItem {
                padding: 0.5rem;
                border-bottom: none;
                cursor: pointer;
            }

            .tabItem.active {
                border-bottom: 2px solid #333;
            }
        `}</style>
    </div>
}

function GenTimestamp() {
    return <div className={
        "helpTable"}>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Java
            </div>
            <div className={
                "tableCell"}>time
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>JavaScript
            </div>
            <div className={
                "tableCell"}>
                <code>
                    Math.round(new Date().getTime()/1000)<br/>
                    <span>getTime()</span>
                </code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Microsoft .NET / C#
            </div>
            <div className={
                "tableCell"}>epoch = (DateTime.Now.ToUniversalTime().Ticks - 621355968000000000) /
                10000000
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>MySQL
            </div>
            <div className={
                "tableCell"}>SELECT unix_timestamp(now())
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Perl
            </div>
            <div className={
                "tableCell"}>time
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>PHP
            </div>
            <div className={
                "tableCell"}>time()
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>PostgreSQL
            </div>
            <div className={
                "tableCell"}>SELECT extract(epoch FROM now())
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Python
            </div>
            <div className={
                "tableCell"}>import time<br/>time.time()
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Ruby
            </div>
            <div className={
                "tableCell"}>
                Time.now.to_i
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Go
            </div>
            <div className={
                "tableCell"}>import time<br/>int32(time.Now().Unix())
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>SQL Server
            </div>
            <div className={
                "tableCell"}>SELECT DATEDIFF(s, '1970-01-01 00:00:00', GETUTCDATE())
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Unix / Linux
            </div>
            <div className={
                "tableCell"}>date +%s
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>VBScript / ASP
            </div>
            <div className={
                "tableCell"}>DateDiff("s", "01/01/1970 00:00:00", Now())
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>
                Perl
            </div>
            <div className={
                "tableCell"}>perl -e "print time"
            </div>
        </div>

        <style jsx>{`
            .helpTable {
                width: 100%;
                padding: 0;
                display: table;
                border-top: 0.5px solid #f0f0f0;
                border-left: 0.5px solid #f0f0f0;
                border-right: 0.5px solid #f0f0f0;
            }

            .tableRow {
                padding: 0;
                text-align: left;
                display: table-row;
            }

            .tableLabel {
                font-weight: normal;
                font-size: 0.9rem;
                display: table-cell;
                width: 10rem;
                background-color: #fafafa;
                border-bottom: 0.5px solid #f0f0f0;
                border-right: 0.5px solid #f0f0f0;
                padding: 0.5rem;
            }

            .tableCell {
                padding: 0.5rem;
                display: table-cell;
                border-bottom: 0.5px solid #f0f0f0;
                font-size: 0.9rem;
                color: #333;
            }
        `}</style>
    </div>
}

function TimestampToDatetime() {
    return <div className={
        "helpTable"}>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Java
            </div>
            <div className={
                "tableCell"}><code>String date = new java.text.SimpleDateFormat("dd/MM/yyyy
                HH:mm:ss").format(new java.util.Date(Unix timestamp * 1000))</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>JavaScript
            </div>
            <div className={
                "tableCell"}><code>var unixTimestamp = new Date(Unix timestamp *
                1000)<br/>commonTime = unixTimestamp.toLocaleString()</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Linux
            </div>
            <div className={
                "tableCell"}><code>date -d @Unix timestamp</code></div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>MySQL
            </div>
            <div className={
                "tableCell"}><code>from_unixtime(Unix timestamp)</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Perl
            </div>
            <div className={
                "tableCell"}><code>my $time = Unix timestamp <br/> my
                ($sec, $min, $hour, $day, $month, $year) = (localtime($time))[0,1,2,3,4,5,6]
            </code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>PHP
            </div>
            <div className={
                "tableCell"}><code>date('r', Unix timestamp)</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>PostgreSQL
            </div>
            <div className={
                "tableCell"}><code>SELECT TIMESTAMP WITH TIME ZONE 'epoch' + Unix timestamp) *
                INTERVAL '1 second';</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Python
            </div>
            <div className={
                "tableCell"}><code>import time <br/> time.gmtime(Unix
                timestamp)</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Ruby
            </div>
            <div className={
                "tableCell"}><code>Time.at(Unix timestamp)</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>SQL Server
            </div>
            <div className={
                "tableCell"}><code>DATEADD(s, Unix timestamp, '1970-01-01 00:00:00')</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>VBScript / ASP
            </div>
            <div className={
                "tableCell"}><code>DateAdd("s", Unix timestamp, "01/01/1970 00:00:00")</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>
                Perl
            </div>
            <div className={
                "tableCell"}>
                <code>perl -e "print scalar(localtime(Unix
                    timestamp))"</code>
            </div>
        </div>
    </div>
}

function DatetimeToTimestamp() {
    return <div className={
        "helpTable"}>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Java
            </div>
            <div className={
                "tableCell"}><code>long epoch = new java.text.SimpleDateFormat("dd/MM/yyyy
                HH:mm:ss").parse("01/01/1970 01:00:00");</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>JavaScript
            </div>
            <div className={
                "tableCell"}><code>var commonTime = new Date(Date.UTC(year, month - 1, day,
                hour, minute, second))</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>MySQL
            </div>
            <div className={
                "tableCell"}><code>
                SELECT unix_timestamp(time)</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Perl
            </div>
            <div className={
                "tableCell"}><code>use Time::Local <br/> my $time =
                timelocal($sec, $min, $hour, $day, $month, $year);</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>PHP
            </div>
            <div className={
                "tableCell"}><code>mktime(hour, minute, second, month,
                day, year)</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>PostgreSQL
            </div>
            <div className={
                "tableCell"}><code>SELECT extract(epoch FROM date('YYYY-MM-DD HH:MM:SS'));</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Python
            </div>
            <div className={
                "tableCell"}><code>import time<br/>
                int(time.mktime(time.strptime('YYYY-MM-DD HH:MM:SS', '%Y-%m-%d %H:%M:%S')))</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Ruby
            </div>
            <div className={
                "tableCell"}><code>Time.local(year, month, day, hour, minute,
                second)</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>SQL Server
            </div>
            <div className={
                "tableCell"}><code>SELECT DATEDIFF(s, '1970-01-01 00:00:00', time)</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>Unix / Linux
            </div>
            <div className={
                "tableCell"}><code>date +%s -d"Jan 1, 1970 00:00:01"</code>
            </div>
        </div>
        <div className={
            "tableRow"}>
            <div className={
                "tableLabel"}>VBScript / ASP
            </div>
            <div className={
                "tableCell"}><code>DateDiff("s", "01/01/1970 00:00:00", time)</code>
            </div>
        </div>

        <style jsx>{`
            .helpTable {
                width: 100%;
                padding: 0;
                display: table;
                border-top: 0.5px solid #f0f0f0;
                border-left: 0.5px solid #f0f0f0;
                border-right: 0.5px solid #f0f0f0;
            }

            .tableRow {
                padding: 0;
                text-align: left;
                display: table-row;
            }

            .tableLabel {
                font-weight: normal;
                font-size: 0.9rem;
                display: table-cell;
                width: 10rem;
                background-color: #fafafa;
                border-bottom: 0.5px solid #f0f0f0;
                border-right: 0.5px solid #f0f0f0;
                padding: 0.5rem;
            }

            .tableCell {
                padding: 0.5rem;
                display: table-cell;
                border-bottom: 0.5px solid #f0f0f0;
                font-size: 0.9rem;
                color: #333;
            }
        `}</style>
    </div>
}
