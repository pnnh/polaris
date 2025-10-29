'use client'

import $ from "jquery";
import {CFTurnstileBody, CFTurnstileOverlay, turnstileScript} from "@/photon/client/cloudflare/turnstile";

import './cloud.scss'
import {useEffect, useState} from "react";
import {localText} from "@/atom/common/language";

export function cfTurnstileSetup(turnstileKey: string, lang: string) {
    console.info('cfTurnstileSetup')
    const overlayEl = $('<div/>', {id: CFTurnstileOverlay});
    const overlayBodyEl = $('<div/>', {class: 'overlayBody'}).appendTo(overlayEl);
    $('<div/>', {class: 'turnstileTip'}).text(localText(lang, '请点击验证', 'Please Click')).appendTo(overlayBodyEl);
    $('<div/>', {id: CFTurnstileBody, class: 'turnstileBody'}).appendTo(overlayBodyEl);
    overlayEl.appendTo('body');
    turnstileScript(turnstileKey, lang);
}

export function CFTurnstile({turnstileKey, lang}: { turnstileKey: string, lang: string }) {
    useEffect(() => {
        window.onloadTurnstileCallback = () => {
            console.info('onloadTurnstileCallback')
            cfTurnstileSetup(turnstileKey, lang);
        }
        return () => {
            window.onloadTurnstileCallback = undefined;
        }
    }, [turnstileKey]);
    return <div id={'CFTurnstilePlaceholder'}></div>
}

