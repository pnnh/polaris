'use client'

import styles from "./link.module.scss";
import {IAuthApp} from "@/photon/common/models/auth";
import {useEffect, useState} from "react";
import {accountSignin, permitAppLogin, queryAuthApp} from "@/photon/client/account/account";
import {CodeOk} from "@/atom/common/models/protocol";
import {Loading} from "@/components/common/loading";

export function LinkSession({lang, portalUrl, signinLink, linkApp}: {
    lang: string, portalUrl: string, signinLink: string, linkApp: string
}) {
    const [appInfo, setAppInfo] = useState<IAuthApp | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [permitResult, setPermitResult] = useState('');
    useEffect(() => {
        queryAuthApp(portalUrl, linkApp).then((getResult) => {
            if (getResult.code !== CodeOk) {
                setErrorMsg('应用信息查询失败')
                return
            }
            const app = getResult.data;
            if (!app || !app.name || app.name !== linkApp || !app.title) {
                setErrorMsg('应用信息无效')
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
            setErrorMsg('授权失败')
            return
        }
        setPermitResult('授权完成，可以关闭该页面')
    }
    if (!appInfo) {
        return <Loading/>
    }
    return <div className={styles.linkSession}>
        <div>是否授权<b>{appInfo.name}</b>登录？</div>
        {errorMsg ?? <div>{errorMsg}</div>}
        {permitResult ? permitResult : <div>
            <button onClick={submitAuth}>同意</button>
            <button onClick={() => {
                window.location.href = '/'
            }}>取消
            </button>
        </div>}
    </div>
}
