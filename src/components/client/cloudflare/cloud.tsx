'use client'

import $ from "jquery";

import './cloud.scss'
import {localText} from "@/atom/common/language";
import {CFTurnstileBody, CFTurnstileOverlay, turnstileScript} from "@/components/client/cloudflare/turnstile";


export function cfTurnstileSetup(turnstileKey: string, lang: string) {
    console.info('cfTurnstileSetup')
    if ($(`#${CFTurnstileOverlay}`).length > 0) {
        return;
    }
    const overlayEl = $('<div/>', {id: CFTurnstileOverlay});
    const overlayBodyEl = $('<div/>', {class: 'overlayBody'}).appendTo(overlayEl);
    $('<div/>', {class: 'turnstileTip'}).text(localText(lang, '请点击验证', 'Please Click')).appendTo(overlayBodyEl);
    $('<div/>', {id: CFTurnstileBody, class: 'turnstileBody'}).appendTo(overlayBodyEl);
    overlayEl.appendTo('body');
    turnstileScript(turnstileKey, lang);
}
