'use client'

import React, {useEffect} from "react";
import {useClientConfig} from "@/services/client/config";
import CloseIcon from '@mui/icons-material/Close';
import './turnstile.scss'

function turnstileScript() {
    let turnstileContent = document.getElementById('turnstile-content')
    if (turnstileContent) {
        return
    }
    window.turnstile.ready(function () {
        turnstileContent = document.createElement('div')
        turnstileContent.id = 'turnstile-content'
        const turnstileBody = document.getElementById('turnstile-body')
        if (!turnstileBody) {
            return;
        }
        turnstileBody.appendChild(turnstileContent)
        const clientConfig = useClientConfig()
        const sitekey = clientConfig.PUBLIC_TURNSTILE
        if (!sitekey) {
            return
        }
        console.log('Turnstile Sitekey', sitekey)
        window.turnstile.render("#turnstile-content", {
            sitekey: sitekey,
            callback: function (token: string) {
                console.log('Challenge Success', token);
                if (window.turnstileCallback) {
                    window.turnstileCallback(token)
                }
                const turnstileContainer = document.getElementById('turnstile-container')
                if (turnstileContainer) {
                    turnstileContainer.style.display = 'none'
                }
            },
        });
    });
}

export async function getTurnstileToken(): Promise<string> {
    const token = window.turnstile.getResponse()
    if (token && !window.turnstile.isExpired()) {
        return Promise.resolve(token)
    }
    const turnstileContainer = document.getElementById('turnstile-container')
    if (turnstileContainer) {
        turnstileContainer.style.display = 'flex'
    }
    return await new Promise((resolve, reject) => {
        window.turnstileCallback = resolve
        setTimeout(() => {
            reject('Timeout')
        }, 50000)
    })
}

export function TurnstileClient() {
    useEffect(() => {
        turnstileScript()
    }, []);

    return <div id={'turnstile-container'} className={'turnstileContainer'}>
        <div className={'turnstileOverlay'}></div>
        <div id={'turnstile-body'} className={'turnstileBody'}>
            <div className={'turnstileToolbar'}>
                <div className={'turnstileTitle'}>请点击验证</div>
                <CloseIcon onClick={() => {
                    const turnstileContainer = document.getElementById('turnstile-container')
                    if (turnstileContainer) {
                        turnstileContainer.style.display = 'none'
                    }
                }}/>
            </div>
        </div>
    </div>
}
