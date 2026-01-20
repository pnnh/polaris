'use client'

import React, {useState} from "react";
import {CodeOk, validateEmail} from "@pnnh/atom";
import {ButtonThrottle} from "@pnnh/atom/browser";
import {getTurnstileToken} from "@/components/client/cloudflare/turnstile";
import {submitSignup} from "@/components/client/account/account";
import {transText, transKey} from "@/components/common/locales/normal";

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
            setInfoMsg(transText(lang, '无效账号名称', 'Invalid username'))
            return
        }
        if (!password || password.length < 1) {
            setInfoMsg(transText(lang, '无效账号密码', 'Invalid password'))
            return
        }
        if (confirmPassword !== password) {
            setInfoMsg(transText(lang, '两次输入的密码不一致', 'Passwords do not match'))
            return
        }
        if (email && !validateEmail(email)) {
            setInfoMsg(transText(lang, '无效电子邮箱', 'Invalid email address'))
            return
        }
        const turnstileToken = await getTurnstileToken()
        if (!turnstileToken) {
            setInfoMsg(transText(lang, '未通过验证', 'Verification failed'))
            return
        }
        const submitRequest = {
            username, password, confirm_password: confirmPassword,
            email, nickname, turnstile_token: turnstileToken,
        }
        const submitResult = await submitSignup(portalUrl, submitRequest)
        console.log('submitResult', submitResult)
        if (submitResult.code !== CodeOk) {
            setInfoMsg(transText(lang, '注册失败', 'Signup failed'))
            return
        }
        setInfoMsg(transText(lang, '注册成功，前往首页...', 'Signup successful, redirecting to homepage...'))
        setTimeout(() => {
            window.location.href = '/'
        }, 1500)
    }

    return (
        <>
        <form className="signupForm">
            <div className="formRow">
                <label htmlFor="username" className="fieldLabel">账号名称</label>
                <input type="text" name="username" className="inputField"
                       placeholder={transText(lang, '字母或数字', 'Letters or numbers')}
                       value={username} onChange={(event) => setUsername(event.target.value)}/>
            </div>
            <div className="formRow">
                <label htmlFor="password" className="fieldLabel">账号密码</label>
                <input type="password" name="password" className="inputField"
                       placeholder={transText(lang, '字母数字及特殊字符', 'Letters, numbers and special characters')}
                       value={password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div className="formRow">
                <label htmlFor="confirmPassword" className="fieldLabel">确认密码</label>
                <input type="password" name="confirmPassword" className="inputField"
                       placeholder={transText(lang, '字母数字及特殊字符', 'Letters, numbers and special characters')}
                       value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)}/>
            </div>
            <div className="formRow">
                <label htmlFor="nickname"
                       className="fieldLabel">{transText(lang, '账号昵称', 'Nickname')}</label>
                <input type="text" name="nickname" className="inputField"
                       placeholder={transText(lang, '可选输入', 'Optional')}
                       value={nickname} onChange={(event) => setNickname(event.target.value)}/>
            </div>
            <div className="formRow">
                <label htmlFor="email" className="fieldLabel">{transText(lang, '电子邮箱', 'Email')}</label>
                <input type="text" name="email" className="inputField"
                       placeholder={transText(lang, '可选输入', 'Optional')}
                       value={email} onChange={(event) => setEmail(event.target.value)}/>
            </div>
            <div className="formRow">
                <button type="button" className="submitButton"
                        onClick={() => {
                            submitForm().then()
                        }}>{transKey(lang, "signup")}
                </button>
                <div>{transText(lang, '已有账号？', 'Already have an account?')}
                    <a href={'/account/signin'}>{transKey(lang, "signin")}</a></div>
            </div>
            <div className="formRow">
                <div className="infoMsg">
                    {infoMsg}
                </div>
            </div>
        </form>
        <style jsx>{`
          .signupForm {
            .formRow {
              margin-bottom: 2rem;
              display: flex;
              flex-direction: row;
              gap: 1rem;
              align-items: center;
              justify-content: center;
            }
            .fieldLabel {
              font-size: 1.0rem;
              font-weight: 400;
              width: 6rem;
              text-align: right;
            }
            .inputField {
              padding: 8px;
              border: solid 1px #e0e0e0;
              border-radius: 4px;
              font-size: 0.9rem;
              width: 284px;
            }
            .submitButton {
              padding: 0.5rem 1rem;
              border: solid 1px #e0e0e0;
              border-radius: 4px;
              background-color: dodgerblue;
              color: #fff;
              font-size: 1rem;
              cursor: pointer;
            }
          }
        `}</style>
        </>
    );
}
