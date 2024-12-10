import styles from './page.module.scss'
import React from 'react'
import {AdminLayout} from "@/components/server/admin/layout";
import {PLSelectResult} from "@/models/common/protocol";
import {PSChannelModel} from "@/models/common/channel";
import {AdminChannelToolbar} from "@/components/client/admin/channels/toolbar";
import {AdminChannelTable} from "@/components/client/admin/channels/table";

export default async function Page() {
    const url = '/admin/articles/?' + 'page=1&size=20'
    //const result = await clientMakeHttpGet<PLSelectResult<PSChannelModel>>(url)
    const result = {} as PLSelectResult<PSChannelModel>
    return <AdminLayout>
        <div>
            <div className={styles.toolBar}>
                <AdminChannelToolbar/>
            </div>
            <div>
                <AdminChannelTable data={result}/>
            </div>
        </div>
    </AdminLayout>
}
