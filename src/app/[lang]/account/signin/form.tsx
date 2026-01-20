'use client'

import {getTurnstileToken} from "@/components/client/cloudflare/turnstile";
import React, {useState} from "react";
import {CodeOk} from "@pnnh/atom";
import {ButtonThrottle} from "@pnnh/atom/browser";
import {accountSignin} from "@/components/client/account/account";
import {transKey, transText} from "@/components/common/locales/normal";

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
        <>
        <form className="signinForm">
            <div className="formRow">
                <label htmlFor="username" className="fieldLabel">账号名称</label>
                <input type="text" name="username" className="inputField"
                       placeholder={transText(lang, '字母或数字', 'Letters or numbers')}
                       value={username} onChange={(event) => setUsername(event.target.value)}/>
            </div>
            <div className="formRow">
                <label htmlFor="password" className="fieldLabel">账号密码</label>
                <input type="password" name="password" className="inputField"
                       autoComplete={'off'}
                       placeholder={transText(lang, '字母数字及特殊字符', 'Letters, numbers and special characters')}
                       value={password} onChange={(event) => setPassword(event.target.value)}/>
            </div>
            <div className="formRow">
                <button type="button" className="submitButton"
                        onClick={() => {
                            submitForm().then()
                        }}>{transKey(lang, "signin")}
                </button>
                <div>{transText(lang, '还没有账号？', 'No account yet?')}<a
                    href={`/${lang}/account/signup`}>{transKey(lang, "signup")}</a></div>
            </div>
            <div className="formRow">
                <div className="infoMsg">
                    {infoMsg}
                </div>
            </div>
        </form>
        <style jsx>{`
          .signinForm {
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
