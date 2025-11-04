'use client'

import $ from "jquery";

export const CFTurnstileOverlay = 'CFTurnstileOverlay'
export const CFTurnstileBody = 'CFTurnstileBody'

function turnstileErrorCallback(error: string) {
    console.error('Challenge Error', error);
    const overlay = $(`#${CFTurnstileOverlay}`)
    if (!overlay) {
        return;
    }
    overlay.show()
}

function turnstileTimeoutCallback() {
    console.info('turnstileTimeoutCallback');
}

function turnstileExpiredCallback() {
    console.info('turnstileExpiredCallback');
}

function turnstileUnsupportedCallback() {
    console.error('turnstileUnsupportedCallback');
}


function turnstileSuccessCallback(token: string) {
    const overlay = $(`#${CFTurnstileOverlay}`)
    if (!overlay) {
        return;
    }
    overlay.hide()
    if (window.turnstileSuccessCallback) {
        window.turnstileSuccessCallback(token)
    }
}

export function turnstileScript(publicTurnstileKey: string, lang: string) {
    console.info('turnstileScript');
    if (typeof window.turnstile === 'undefined') {
        console.error('Turnstile not found')
        return;
    }

    window.turnstile.render(`#${CFTurnstileBody}`, {
        sitekey: publicTurnstileKey,
        language: lang,
        callback: turnstileSuccessCallback,
        "error-callback": turnstileErrorCallback,
        "expired-callback": turnstileExpiredCallback,
        "unsupported-callback": turnstileUnsupportedCallback,
        "timeout-callback": turnstileTimeoutCallback
    });
}

export async function getTurnstileToken(): Promise<string | undefined> {
    console.info('getTurnstileToken');
    if (!window.turnstile) {
        return;
    }
    const token = window.turnstile.getResponse()
    if (token && !window.turnstile.isExpired()) {
        return token
    }
    const overlay = $(`#${CFTurnstileOverlay}`)
    if (!overlay) {
        return;
    }
    overlay.show()
    return new Promise<string | undefined>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error(`Promise timed out after 5s`));
        }, 30000);
        window.turnstileSuccessCallback = (token: string) => {
            clearTimeout(timer)
            resolve(token)
        }
    })
}
