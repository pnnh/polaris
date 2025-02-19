'use client'

import React, {useEffect} from "react";
import {useClientConfig} from "@/services/client/config";

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
        window.turnstile.render("#turnstile-content", {
            sitekey: sitekey,
            callback: function (token: string) {
                //console.log('Challenge Success', token);
            },
        });
    });
}

export function getTurnstileToken(): string | undefined {
    const token = window.turnstile.getResponse()
    if (token && !window.turnstile.isExpired()) {
        return token
    }
    return undefined
}

export function TurnstileClient() {
    useEffect(() => {
        turnstileScript()
    }, []);

    return <div id={'turnstile-body'} className={'turnstileBody'}>
    </div>
}
