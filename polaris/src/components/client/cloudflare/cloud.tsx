'use client'

import $ from "jquery";

import {CFTurnstileBody, CFTurnstileOverlay, turnstileScript} from "@/components/client/cloudflare/turnstile";
import {transKey} from "@/components/common/locales/normal";


export function cfTurnstileSetup(turnstileKey: string, lang: string) {
    console.info('cfTurnstileSetup')
    if ($(`#${CFTurnstileOverlay}`).length > 0) {
        return;
    }
    const overlayEl = $('<div/>', {id: CFTurnstileOverlay});
    const overlayBodyEl = $('<div/>', {class: 'overlayBody'}).appendTo(overlayEl);
    $('<div/>', {class: 'turnstileTip'}).text(transKey(lang, 'cloudflare.pleaseClick')).appendTo(overlayBodyEl);
    $('<div/>', {id: CFTurnstileBody, class: 'turnstileBody'}).appendTo(overlayBodyEl);
    overlayEl.appendTo('body');
    turnstileScript(turnstileKey, lang);

    // Add styles dynamically
    if (!$('#cf-turnstile-styles').length) {
        $('<style id="cf-turnstile-styles">').text(`
                #CFTurnstileOverlay {
                  display: none;
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-color: #fff;
                  filter: alpha(opacity=50);
                  opacity: 0.99;
                  z-index: 10000;
                }
                #CFTurnstileOverlay .overlayBody {
                  width: 500px;
                  margin: 200px auto;
                }
                #CFTurnstileOverlay .overlayBody .turnstileTip {
                  font-size: 1.5rem;
                  color: #000;
                  margin-bottom: 1rem;
                }
            `).appendTo('head');
    }
}
