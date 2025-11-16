'use client'

import styles from './form.module.scss'
import {getTurnstileToken} from "@/components/client/cloudflare/turnstile";
import React, {useState} from "react";
import {CodeOk} from "@/atom/common/models/protocol";
import {ButtonThrottle} from "@/atom/client/button/throttle";
import {accountSignin} from "@/components/client/account/account";
import {transText, transKey} from "@/components/common/locales/normal";

const buttonThrottle = new ButtonThrottle(1000)

export function SigninForm({lang, portalUrl, signinLink, linkApp, signinCallback}: {
    lang: string, portalUrl: string,
    signinLink: string, linkApp: string, signinCallback: string
}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [infoMsg, setInfoMsg] = useState('')

    const submitForm = async () => {
        if (!await buttonThrottle.throttle()) {
            setInfoMsg(transKey(lang, "frequentOperation"))
            return
        }
        if (!username || username.length < 1) {
            setInfoMsg(transKey(lang, "invalidUsername"))
            return
        }
        if (!password || password.length < 1) {
            setInfoMsg(transKey(lang, "invalidPassword"))
            return
        }
        const turnstileToken = await getTurnstileToken()

        if (!turnstileToken) {
            setInfoMsg(transKey(lang, "unauthorized"))
            return
        }
        const submitRequest = {
            username, password, turnstile_token: turnstileToken, link: signinLink
        }
        const submitResult = await accountSignin(portalUrl, submitRequest)
        if (submitResult.code !== CodeOk) {
            setInfoMsg(transKey(lang, 'loginFailed'))
            return
        }
        if (signinLink && linkApp) {
            setInfoMsg(transText(lang, '登录成功，前往授权页面...', 'Login successful, redirecting to authorization page...'))
            setTimeout(() => {
                window.location.href = `/${lang}/account/signin?app=${encodeURIComponent(linkApp)}&link=${encodeURIComponent(signinLink)}&redirect=${signinCallback}`
            }, 1500)
        } else {
            setInfoMsg(transKey(lang, 'loginSuccessRedirecting'))
            setTimeout(() => {
                window.location.href = '/'
            }, 1500)
        }
    }

    return (
        <form className={styles.signinForm}>
            <div className={styles.formRow}>
                <label htmlFor="username" className={styles.fieldLabel}>账号名称</label>
                <input type="text" name="username" className={styles.inputField}
                       placeholder={transText(lang, '字母或数字', 'Letters or numbers')}
                       value={username} onChange={(event) => setUsername(event.target.value)}/>
            </div>
            <div className={styles.formRow}>
                <label htmlFor="password" className={styles.fieldLabel}>账号密码</label>
                <input type="password" name="password" className={styles.inputField}
                       placeholder={transText(lang, '字母数字及特殊字符', 'Letters, numbers and special characters')}
                       value={password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div className={styles.formRow}>
                <button type="button" className={styles.submitButton}
                        onClick={() => {
                            submitForm().then()
                        }}>{transKey(lang, "signin")}
                </button>
                <div>{transText(lang, '还没有账号？', 'No account yet?')}<a
                    href={`/${lang}/account/signup`}>{transKey(lang, "signup")}</a></div>
            </div>
            <div className={styles.formRow}>
                <div className={'infoMsg'}>
                    {infoMsg}
                </div>
            </div>
        </form>
    );
}
