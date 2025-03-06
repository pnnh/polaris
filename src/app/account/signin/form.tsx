'use client'

import styles from './form.module.scss'
import {getTurnstileToken, TurnstileClient} from "@/atom/client/components/cloudflare/turnstile";
import React, {useState} from "react";
import {CodeOk} from "@/atom/common/models/protocol";
import {ButtonThrottle} from "@/atom/client/button/throttle";
import {accountSignin} from "@/services/client/account/account";

const buttonThrottle = new ButtonThrottle(1000)

export function SigninForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [infoMsg, setInfoMsg] = useState('')

    const submitForm = async () => {
        if (!await buttonThrottle.throttle()) {
            setInfoMsg('操作过于频繁')
            return
        }
        if (!username || username.length < 1) {
            setInfoMsg('无效账号名称')
            return
        }
        if (!password || password.length < 1) {
            setInfoMsg('无效密码')
            return
        }
        const turnstileToken = getTurnstileToken()
        // console.log('turnstile token', turnstileToken)
        if (!turnstileToken) {
            setInfoMsg('未通过验证')
            return
        }
        const submitRequest = {
            username, password, turnstile_token: turnstileToken,
        }
        const submitResult = await accountSignin(submitRequest)
        console.log('submitResult', submitResult)
        if (submitResult.code !== CodeOk) {
            setInfoMsg('登录失败')
            return
        }
        setInfoMsg('登录成功，前往首页...')
        setTimeout(() => {
            window.location.href = '/'
        }, 1500)
    }

    return (
        <form className={styles.signinForm}>
            <div className={styles.formRow}>
                <label htmlFor="username" className={styles.fieldLabel}>账号名称</label>
                <input type="text" name="username" className={styles.inputField}
                       placeholder={'字母或数字'}
                       value={username} onChange={(event) => setUsername(event.target.value)}/>
            </div>
            <div className={styles.formRow}>
                <label htmlFor="password" className={styles.fieldLabel}>账号密码</label>
                <input type="password" name="password" className={styles.inputField}
                       placeholder={'字母数字及特殊字符'}
                       value={password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div className={styles.formRow}>
                <label className={styles.fieldLabel}>行为验证</label>
                <TurnstileClient/>
            </div>
            <div className={styles.formRow}>
                <button type="button" className={styles.submitButton}
                        onClick={() => {
                            submitForm().then()
                        }}>登录
                </button>
                <div>还没有账号？前往<a href={'/account/signup'}>注册</a></div>
            </div>
            <div className={styles.formRow}>
                <div className={'infoMsg'}>
                    {infoMsg}
                </div>
            </div>
        </form>
    );
}
