'use client'

import $ from 'jquery';
import {turnstileScript} from "@/photon/client/cloudflare/turnstile";

import './cloud.scss'
import {useClientConfig} from "@/services/client/config";
import {useEffect, useState} from "react";

function cfTurnstileSetup() {
    const overlayEl = $('<div/>', {id: 'cfTurnstileOverlay'});
    const overlayBodyEl = $('<div/>', {class: 'overlayBody'}).appendTo(overlayEl);
    $('<div/>', {class: 'turnstileTip'}).text('请点击验证').appendTo(overlayBodyEl);
    $('<div/>', {id: 'turnstile-body', class: 'turnstileBody'}).appendTo(overlayBodyEl);
    overlayEl.appendTo('body');
    const browserConfig = useClientConfig()
    turnstileScript(browserConfig.PUBLIC_TURNSTILE);
}

function setupAll() {
    if (window.turnstile) {
        cfTurnstileSetup();
    } else {
        console.warn('Cloudflare Turnstile is not available, skipping setup.');
    }
}


export function CFTurnstile() {
    const [show, setShow] = useState(false)
    useEffect(() => {
        const anchorElement = document.getElementById('cfTurnstileOverlay')
        if (anchorElement) {
            return
        }
        setupAll()
    })
    return <div id={'CFTurnstile'}>
    </div>
}
