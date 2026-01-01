'use client'

import styles from "./link.module.scss";
import {IAuthApp} from "@/components/common/models/auth";
import {useEffect, useState} from "react";
import {permitAppLogin, queryAuthApp} from "@/components/client/account/account";
import {CodeOk} from "@pnnh/atom";
import {Loading} from "@/components/common/loading";
import {transText} from "@/components/common/locales/normal";

export function LinkSession({lang, portalUrl, signinLink, linkApp, signinCallback}: {
    lang: string, portalUrl: string, signinLink: string, linkApp: string, signinCallback: string
}) {
    const [appInfo, setAppInfo] = useState<IAuthApp | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [permitResult, setPermitResult] = useState('');
    useEffect(() => {
        queryAuthApp(portalUrl, linkApp).then((getResult) => {
            if (getResult.code !== CodeOk) {
                setErrorMsg(transText(lang, '应用信息查询失败', 'Failed to query application information'));
                return
            }
            const app = getResult.data;
            if (!app || !app.name || app.name !== linkApp || !app.title) {
                setErrorMsg(transText(lang, '应用信息无效', 'Invalid application information'));
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
        if (submitResult.code !== CodeOk || !submitResult.data || !submitResult.data.uid) {
            setErrorMsg(transText(lang, '授权失败', 'Authorization failed'));
            return
        }
        if (signinCallback && signinCallback.startsWith("https://")) {
            // 如果有回调地址，跳转到回调地址
            const parsedUrl = new URL(signinCallback);
            parsedUrl.searchParams.set('app', linkApp);
            parsedUrl.searchParams.set('link', signinLink);
            parsedUrl.searchParams.set('session', submitResult.data.uid);
            // 使用新的URL进行跳转
            window.location.href = parsedUrl.toString();
        } else {
            setPermitResult(transText(lang, '授权完成，可以关闭该页面', 'Authorization completed, you can close this page'));
        }
    }
    if (!appInfo) {
        return <div>
            <Loading/>
            {errorMsg ?? <div>{errorMsg}</div>}
        </div>
    }
    return <div className={styles.linkSession}>
        <div>{transText(lang, '是否授权？', 'Authorization?')}<b>{appInfo.name}</b></div>
        {errorMsg ?? <div>{errorMsg}</div>}
        {permitResult ? permitResult : <div>
            <button onClick={submitAuth}>{transText(lang, '同意', 'Accept')}</button>
            <button onClick={() => {
                window.location.href = '/'
            }}>{transText(lang, '拒绝', 'Reject')}
            </button>
        </div>}
    </div>
}
