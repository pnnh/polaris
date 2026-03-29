'use client'

import React, {useState} from "react";
import {CodeOk, validateEmail} from "@pnnh/atom";
import {ButtonThrottle} from "@pnnh/atom/browser";
import {getTurnstileToken} from "@/components/client/cloudflare/turnstile";
import {submitSignup} from "@/components/client/account/account";
import {transKey} from "@/components/common/locales/normal";
import {css} from "@/gen/styled/css";

const buttonThrottle = new ButtonThrottle(5000)

export function SignupForm({lang, portalUrl}: { lang: string, portalUrl: string }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [infoMsg, setInfoMsg] = useState('')

    const submitForm = async () => {
        if (!await buttonThrottle.throttle()) {
            setInfoMsg(transKey(lang, "frequentOperation"))
            return
        }
        if (!username || username.length < 1) {
            setInfoMsg(transKey(lang, "signup.invalidUsername"))
            return
        }
        if (!password || password.length < 1) {
            setInfoMsg(transKey(lang, "signup.invalidPassword"))
            return
        }
        if (confirmPassword !== password) {
            setInfoMsg(transKey(lang, "signup.passwordsNotMatch"))
            return
        }
        if (email && !validateEmail(email)) {
            setInfoMsg(transKey(lang, "signup.invalidEmail"))
            return
        }
        const submitRequest = {
            username, password, confirm_password: confirmPassword,
            email, nickname,
        }
        const submitResult = await submitSignup(portalUrl, submitRequest)
        console.log('submitResult', submitResult)
        if (submitResult.code !== CodeOk) {
            setInfoMsg(transKey(lang, "signup.signupFailed"))
            return
        }
        setInfoMsg(transKey(lang, "signup.signupSuccess"))
        setTimeout(() => {
            window.location.href = '/'
        }, 1500)
    }

    return (
        <>
            <form className={signupStyles.signupForm}>
                <div className={signupStyles.formRow}>
                    <label htmlFor="username" className={signupStyles.fieldLabel}>账号名称</label>
                    <input type="text" name="username" className={signupStyles.inputField}
                           placeholder={transKey(lang, "signup.usernamePlaceholder")}
                           value={username} onChange={(event) => setUsername(event.target.value)}/>
                </div>
                <div className={signupStyles.formRow}>
                    <label htmlFor="password" className={signupStyles.fieldLabel}>账号密码</label>
                    <input type="password" name="password" className={signupStyles.inputField}
                           placeholder={transKey(lang, "signup.passwordPlaceholder")}
                           value={password} onChange={(event) => setPassword(event.target.value)}/>
                </div>
                <div className={signupStyles.formRow}>
                    <label htmlFor="confirmPassword" className={signupStyles.fieldLabel}>确认密码</label>
                    <input type="password" name="confirmPassword" className={signupStyles.inputField}
                           placeholder={transKey(lang, "signup.passwordPlaceholder")}
                           value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
                </div>
                <div className={signupStyles.formRow}>
                    <label htmlFor="nickname"
                           className={signupStyles.fieldLabel}>{transKey(lang, "signup.nickname")}</label>
                    <input type="text" name="nickname" className={signupStyles.inputField}
                           placeholder={transKey(lang, "signup.optional")}
                           value={nickname} onChange={(event) => setNickname(event.target.value)}/>
                </div>
                <div className={signupStyles.formRow}>
                    <label htmlFor="email" className={signupStyles.fieldLabel}>{transKey(lang, "signup.email")}</label>
                    <input type="text" name="email" className={signupStyles.inputField}
                           placeholder={transKey(lang, "signup.optional")}
                           value={email} onChange={(event) => setEmail(event.target.value)}/>
                </div>
                <div className={signupStyles.formRow}>
                    <button type="button" className={signupStyles.submitButton}
                            onClick={() => {
                                submitForm().then()
                            }}>{transKey(lang, "signup")}
                    </button>
                    <div>{transKey(lang, "signup.alreadyHaveAccount")}
                        <a href={'/account/signin'}>{transKey(lang, "signin")}</a></div>
                </div>
                <div className={signupStyles.formRow}>
                    <div className={signupStyles.infoMsg}>
                        {infoMsg}
                    </div>
                </div>
            </form>
        </>
    );
}

const signupStyles = {
    signupForm: css``,
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
