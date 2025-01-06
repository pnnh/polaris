'use client'

import Link from "next/link";
import React, {useEffect} from "react";
import './userinfo.scss'
import {AccountModel} from "@/atom/common/models/account";
import {accountSignout, getUserinfo} from "@/services/client/account/account";

export function UserAction() {
    const [userinfo, setUserinfo] = React.useState<AccountModel | undefined>(undefined)
    useEffect(() => {
        getUserinfo().then((result) => {
            if (!result || !result.data) {
                return
            }
            setUserinfo(result.data)
        })
    }, []);
    if (userinfo) {
        return <div className={'userAction'}>
            <Link className={'loginLink'} href={'/account/profile'}>{userinfo.nickname || userinfo.username}</Link>
            <a className={'logoutLink'} href={'javascript:void(0)'} onClick={() => {
                accountSignout({}).then(() => {
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
