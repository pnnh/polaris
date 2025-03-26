'use client'

import Link from "next/link";
import React, {useEffect} from "react";
import './userinfo.scss'
import {AccountModel} from "@/atom/common/models/account";
import {CodeOk} from "@/atom/common/models/protocol";
import {accountSignout, getUserinfo} from "@/atom/client/account/account";

export function UserAction({portalUrl}: { portalUrl: string }) {
    const [userinfo, setUserinfo] = React.useState<AccountModel | undefined>(undefined)
    useEffect(() => {
        getUserinfo(portalUrl).then((result) => {
            if (!result || result.code != CodeOk || !result.data) {
                return
            }
            setUserinfo(result.data)
        })
    }, []);
    if (userinfo && userinfo.uid !== '00000000-0000-0000-0000-000000000000') {
        return <div className={'userAction'}>
            <Link className={'loginLink'} href={'/account/profile'}>{userinfo.nickname || userinfo.username}</Link>
            <a className={'logoutLink'} href={'javascript:void(0)'} onClick={() => {
                accountSignout(portalUrl, {}).then(() => {
                    window.location.href = '/'
                })
            }}>退出</a>
        </div>
    }
    return <div className={'userAction'}>
        <Link className={'loginLink'} href={'/account/signin'}>登录</Link>
        <Link className={'loginLink'} href={'/account/signup'}>注册</Link>
    </div>
}
