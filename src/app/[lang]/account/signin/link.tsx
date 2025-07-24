'use client'

import styles from "./link.module.scss";
import {IAuthApp} from "@/photon/common/models/auth";
import {useEffect, useState} from "react";
import {accountSignin, permitAppLogin, queryAuthApp} from "@/photon/client/account/account";
import {CodeOk} from "@/atom/common/models/protocol";
import {Loading} from "@/components/common/loading";
import {localText} from "@/atom/common/language";

export function LinkSession({lang, portalUrl, signinLink, linkApp}: {
    lang: string, portalUrl: string, signinLink: string, linkApp: string
}) {
    const [appInfo, setAppInfo] = useState<IAuthApp | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [permitResult, setPermitResult] = useState('');
    useEffect(() => {
        queryAuthApp(portalUrl, linkApp).then((getResult) => {
            if (getResult.code !== CodeOk) {
                setErrorMsg(localText(lang, '应用信息查询失败', 'Failed to query application information'));
                return
            }
            const app = getResult.data;
            if (!app || !app.name || app.name !== linkApp || !app.title) {
                setErrorMsg(localText(lang, '应用信息无效', 'Invalid application information'));
                return
            }
            setAppInfo(app);
        })
    }, [linkApp])

    const submitAuth = async () => {
        const submitRequest = {
            app: linkApp, link: signinLink
        }
        const submitResult = await permitAppLogin(portalUrl, submitRequest)
        console.log('submitResult', submitResult)
        if (submitResult.code !== CodeOk) {
            setErrorMsg(localText(lang, '授权失败', 'Authorization failed'));
            return
        }
        setPermitResult(localText(lang, '授权完成，可以关闭该页面', 'Authorization completed, you can close this page'));
    }
    if (!appInfo) {
        return <Loading/>
    }
    return <div className={styles.linkSession}>
        <div>{localText(lang, '是否授权？', 'Authorization?')}<b>{appInfo.name}</b></div>
        {errorMsg ?? <div>{errorMsg}</div>}
        {permitResult ? permitResult : <div>
            <button onClick={submitAuth}>{localText(lang, '同意', 'Accept')}</button>
            <button onClick={() => {
                window.location.href = '/'
            }}>{localText(lang, '拒绝', 'Reject')}
            </button>
        </div>}
    </div>
}
