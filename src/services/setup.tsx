'use client'

import {useClientConfig} from "@/atom/client/config/config";
import {IBrowserConfig} from "@/components/common/config";
import {cfTurnstileSetup} from "@/components/client/cloudflare/cloud";
import {langEnUS} from "@/components/common/language";
import $ from 'jquery';

function setupPWA(lang: string) {
    // const manifestLink = document.getElementById('manifest-link') as HTMLLinkElement | null;
    // if (!manifestLink) {
    //     return
    // }
    // if (manifestLink.dataset.setupPWA === "true") {
    //     return
    // }
    // manifestLink.dataset.setupPWA = "true";

    const registerServiceWorker = async () => {
        if ("serviceWorker" in navigator) {
            try {
                // First, get all existing registrations
                // navigator.serviceWorker.getRegistrations().then((registrations) => {
                //     console.log(`Found ${registrations.length} Service Workers:`, registrations);
                //
                //     // Traverse and uninstall each one
                //     const unregisterPromises = registrations.map((registration) => {
                //         console.log(`Unregistering SW for scope: ${registration.scope}`);
                //         return registration.unregister();
                //     });
                //
                //     return Promise.all(unregisterPromises);
                // }).then((results) => {
                //     console.log('All unregistrations completed:', results);  // Array of true/false
                // }).catch((error) => {
                //     console.error('Failed to unregister SWs:', error);
                // });

                // Setup message handler to receive messages from the service worker
                let msgHandler = (event: MessageEvent) => {
                    console.log('Received message from SW:', event.data);

                    const {type, status, timestamp} = event.data;  // Parse as needed

                    if (type === 'PERIODIC_UPDATE') {
                        console.log('Reply confirmed:', status, 'at', timestamp);
                        // Handle the reply, e.g., update UI
                    } else if (type === 'SQLITE_READY') {
                        console.log('SQLite is ready in SW at', timestamp);
                    }
                }
                navigator.serviceWorker.addEventListener('message', msgHandler);

                // Now register the new service worker
                const workerUrl = '/worker.js'
                const registration = await navigator.serviceWorker.register(workerUrl, {
                    scope: "/",
                    type: 'module'
                });
                if (registration.installing) {
                    console.log("Installing Service worker");
                } else if (registration.waiting) {
                    console.log("Service worker installed");
                } else if (registration.active) {
                    console.log("Active Service worker");
                }
            } catch (error) {
                console.error(`ServiceWorker register failed：${error}`);
            }
        }
    };
    // const workerInfo = getStorage('worker-info');
    // if (workerInfo) {
    //     const info = workerInfo;
    //     const now = Date.now();
    //     const duration = 3 * 24 * 3600 * 1000
    //     if (info.timestamp && now - info.timestamp < duration) {
    //         console.log('ServiceWorker recently unregistered, skip registering');
    //         return;
    //     }
    // }
    registerServiceWorker().then(() => {
        console.log('ServiceWorker registered');
        // const workerInfo = {timestamp: Date.now()};
        // setStorage('worker-info', workerInfo);
    }).catch(e => {
        console.error('ServiceWorker register error', e);
    });
}

function setupSqlite() {
    const worker = new Worker(new URL('./sqlite.ts', import.meta.url));
    worker.postMessage({action: 'SQLITE_INIT'});
    worker.onmessage = (e) => {
        if (e.data.success) {
            console.log('DB ready:', e.data.isPersistent ? 'Persistent (OPFS)' : 'In-memory fallback');
        } else {
            console.error('Init failed:', e.data.error);
        }
    };
}

function setupNow() {
    (window as any).isClient = true
    window.Prism = window.Prism || {};
    window.Prism.manual = true;     // 禁止Prism自动高亮代码块，否则会导致服务端和客户端渲染结果不一致错误

    const clientConfig = useClientConfig('') as IBrowserConfig
    if (clientConfig && clientConfig.PUBLIC_TURNSTILE) {
        const turnstileKey = clientConfig.PUBLIC_TURNSTILE;
        const lang = navigator.language;
        console.log('Cloudflare Turnstile setup, lang:', lang);
        (window as any).onloadTurnstileCallback = () => {
            console.info('onloadTurnstileCallback')
            cfTurnstileSetup(turnstileKey, lang);
        }
    }
}

// 需要页面加载后立即执行的初始化，不用等待页面完全加载
setupNow()

$(async function () {
    const lang = document.documentElement.lang || langEnUS;
    setupPWA(lang)

    setupSqlite()
})
