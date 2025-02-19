'use client'

import styles from './form.module.scss'
import {getTurnstileToken, TurnstileClient} from "@/components/client/cloudflare/turnstile";
import React, {useState} from "react";
import {validateEmail} from "@/atom/common/utils/email";
import {isValidUrl} from "@/atom/common/utils/uri";
import {CodeOk} from "@/atom/common/models/protocol";
import {ButtonThrottle} from "@/atom/client/button/throttle";
import {submitSignup} from "@/services/client/account/account";

const buttonThrottle = new ButtonThrottle(5000)

export function SignupForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
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
        if (confirmPassword !== password) {
            setInfoMsg('密码不一致')
            return
        }
        if (email && !validateEmail(email)) {
            setInfoMsg('无效邮箱')
            return
        }
        const turnstileToken = getTurnstileToken()
        // console.log('turnstile token', turnstileToken)
        if (!turnstileToken) {
            setInfoMsg('未通过验证')
            return
        }
        const submitRequest = {
            username, password, confirm_password: confirmPassword,
            email, nickname, turnstile_token: turnstileToken,
        }
        const submitResult = await submitSignup(submitRequest)
        console.log('submitResult', submitResult)
        if (submitResult.code !== CodeOk) {
            setInfoMsg('注册失败')
            return
        }
        setInfoMsg('注册成功，前往首页...')
        setTimeout(() => {
            window.location.href = '/'
        }, 1500)
    }

    return (
        <form className={styles.signupForm}>
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
                <label htmlFor="confirmPassword" className={styles.fieldLabel}>确认密码</label>
                <input type="password" name="confirmPassword" className={styles.inputField}
                       placeholder={'字母数字及特殊字符'}
                       value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
            </div>
            <div className={styles.formRow}>
                <label htmlFor="nickname" className={styles.fieldLabel}>账号昵称</label>
                <input type="text" name="nickname" className={styles.inputField}
                       placeholder={'可选输入'}
                       value={nickname} onChange={(event) => setNickname(event.target.value)}/>
            </div>
            <div className={styles.formRow}>
                <label htmlFor="email" className={styles.fieldLabel}>电子邮箱</label>
                <input type="text" name="email" className={styles.inputField}
                       placeholder={'可选输入'}
                       value={email} onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div className={styles.formRow}>
                <label className={styles.fieldLabel}>行为验证</label>
                <TurnstileClient/>
            </div>
            <div className={styles.formRow}>
                <button type="button" className={styles.submitButton}
                        onClick={() => {
                            submitForm().then()
                        }}>注册
                </button>
                <div>已有账号？前往<a href={'/account/signin'}>登录</a></div>
            </div>
            <div className={styles.formRow}>
                <div className={'infoMsg'}>
                    {infoMsg}
                </div>
            </div>
        </form>
    );
}
