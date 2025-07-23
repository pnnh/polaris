'use client'

import $ from 'jquery';
import {turnstileScript} from "@/photon/client/cloudflare/turnstile";

import './cloud.scss'
import {useEffect, useState} from "react";

function cfTurnstileSetup(turnstileKey: string) {
    const overlayEl = $('<div/>', {id: 'cfTurnstileOverlay'});
    const overlayBodyEl = $('<div/>', {class: 'overlayBody'}).appendTo(overlayEl);
    $('<div/>', {class: 'turnstileTip'}).text('请点击验证').appendTo(overlayBodyEl);
    $('<div/>', {id: 'turnstile-body', class: 'turnstileBody'}).appendTo(overlayBodyEl);
    overlayEl.appendTo('body');
    turnstileScript(turnstileKey);
}

export function CFTurnstile({turnstileKey}: { turnstileKey: string }) {
    // const [show, setShow] = useState(false)
    useEffect(() => {
        const anchorElement = document.getElementById('cfTurnstileOverlay')
        if (anchorElement) {
            return
        }
        if (window.turnstile) {
            cfTurnstileSetup(turnstileKey);
        } else {
            console.warn('Cloudflare Turnstile is not available, skipping setup.');
        }
    })
    return <div id={'CFTurnstile'}>
    </div>
}
