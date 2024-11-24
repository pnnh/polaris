import styles from './page.module.scss'
import React from 'react'
import {Toolbar} from './partials/toolbar'
import {ChannelTable} from './partials/table'
import {PLSelectResult} from '@pnnh/polaris-business'
import {clientMakeHttpGet} from '@/services/client/http'
import {PSChannelModel} from "@pnnh/polaris-business";

export default async function Page() {
    const url = '/admin/channels/?' + 'page=1&size=20'
    const result = await clientMakeHttpGet<PLSelectResult<PSChannelModel>>(url)

    return <div>
        <div className={styles.toolBar}>
            <Toolbar/>
        </div>
        <div>
            <ChannelTable data={result}/>
        </div>
    </div>
}
