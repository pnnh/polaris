'use client'

import {IAuthApp} from "@/components/common/models/auth";
import {useEffect, useState} from "react";
import {permitAppLogin, queryAuthApp} from "@/components/client/account/account";
import {CodeOk} from "@pnnh/atom";
import {Loading} from "@/components/common/loading";
import {transKey} from "@/components/common/locales/normal";

export function LinkSession({lang, portalUrl, signinLink, linkApp, signinCallback}: {
    lang: string, portalUrl: string, signinLink: string, linkApp: string, signinCallback: string
}) {
    const [appInfo, setAppInfo] = useState<IAuthApp | null>(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [permitResult, setPermitResult] = useState('');
    useEffect(() => {
        queryAuthApp(portalUrl, linkApp).then((getResult) => {
            if (getResult.code !== CodeOk) {
                setErrorMsg(transKey(lang, "auth.queryAppFailed"));
                return
            }
            const app = getResult.data;
            if (!app || !app.name || app.name !== linkApp || !app.title) {
                setErrorMsg(transKey(lang, "auth.invalidAppInfo"));
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
            setErrorMsg(transKey(lang, "auth.authorizationFailed"));
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
            setPermitResult(transKey(lang, "auth.authorizationCompleted"));
        }
    }
    if (!appInfo) {
        return <div>
            <Loading/>
            {errorMsg ?? <div>{errorMsg}</div>}
        </div>
    }
    return <>
        <div className="linkSession">
            <div>{transKey(lang, "auth.authorizationQuestion")}<b>{appInfo.name}</b></div>
            {errorMsg ?? <div>{errorMsg}</div>}
            {permitResult ? permitResult : <div>
                <button onClick={submitAuth}>{transKey(lang, "auth.accept")}</button>
                <button onClick={() => {
                    window.location.href = '/'
                }}>{transKey(lang, "auth.reject")}
                </button>
            </div>}
        </div>
        <style jsx>{`
            .linkSession {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                padding: 20px;
            }
        `}</style>
    </>
}
