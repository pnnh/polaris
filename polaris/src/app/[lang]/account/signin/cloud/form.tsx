'use client'

import {getTurnstileToken} from "@/components/client/cloudflare/turnstile";
import React, {useState} from "react";
import {CodeOk} from "@pnnh/atom";
import {ButtonThrottle} from "@pnnh/atom/browser";
import {accountSignin} from "@/components/client/account/account";
import {transKey} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

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
            setInfoMsg(transKey(lang, "signin.loginSuccessAuth"))
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
        <>
            <form className={formStyles.signinForm}>
                <div className={formStyles.formRow}>
                    <label htmlFor="username" className={formStyles.fieldLabel}>账号名称</label>
                    <input type="text" name="username" className={formStyles.inputField}
                           placeholder={transKey(lang, "signin.usernamePlaceholder")}
                           value={username} onChange={(event) => setUsername(event.target.value)}/>
                </div>
                <div className={formStyles.formRow}>
                    <label htmlFor="password" className={formStyles.fieldLabel}>账号密码</label>
                    <input type="password" name="password" className={formStyles.inputField}
                           autoComplete={'off'}
                           placeholder={transKey(lang, "signin.passwordPlaceholder")}
                           value={password} onChange={(event) => setPassword(event.target.value)}/>
                </div>
                <div className={formStyles.formRow}>
                    <button type="button" className={formStyles.submitButton}
                            onClick={() => {
                                submitForm().then()
                            }}>{transKey(lang, "signin")}
                    </button>
                    <div>{transKey(lang, "signin.noAccountYet")}<a
                        href={`/${lang}/account/signup`}>{transKey(lang, "signup")}</a></div>
                </div>
                <div className={formStyles.formRow}>
                    <div className={formStyles.infoMsg}>
                        {infoMsg}
                    </div>
                </div>
            </form>
        </>
    );
}

const formStyles = {
    signinForm: css``,
    formRow: css`
        margin-bottom: 2rem;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        justify-content: center;
    `,
    fieldLabel: css`
        font-size: 1.0rem;
        font-weight: 400;
        width: 6rem;
        text-align: right;
    `,
    inputField: css`
        padding: 8px;
        border: solid 1px #e0e0e0;
        border-radius: 4px;
        font-size: 0.9rem;
        width: 284px;
    `,
    submitButton: css`
        padding: 0.5rem 1rem;
        border: solid 1px #e0e0e0;
        border-radius: 4px;
        background-color: dodgerblue;
        color: #fff;
        font-size: 1rem;
        cursor: pointer;
    `,
    infoMsg: css``
}
