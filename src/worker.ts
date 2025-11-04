// Use the install event to pre-cache all initial resources.
import {clientConsoleSelectLibraries} from "@/components/client/libraries/library";

import {entries, set, get} from 'idb-keyval';

self.addEventListener('install', event => {
    console.log('Service worker install', event);
    // event.waitUntil((async () => {
    //     const cache = await caches.open(CACHE_NAME);
    //     cache.addAll([
    //         '/',
    //     ]);
    // })());
});

self.onmessage = async (event) => {
    console.log('Received message', event.data);
    const {type, data} = event.data;
    const {portalUrl} = data;
    if (type === 'PERIODIC_UPDATE') {
        const selectResult = await clientConsoleSelectLibraries(portalUrl, {})
        console.log('Fetched libraries from portal:', selectResult);
        if (selectResult && selectResult.range && selectResult.range.length > 0) {
            selectResult.range.forEach((range) => {
                console.log('Library:', range.name, range.title);
                const entryKey = `library-${range.name}`;
                set(entryKey, range).then(() => {
                    console.log(`Stored library entry in IndexedDB with key: ${entryKey}`);
                }).catch((err) => {
                    console.error(`Failed to store library entry ${entryKey}:`, err);
                });
            })
        }
        if (event.source) {
            event.source.postMessage({dbId: 'my-db', ready: true});
        }
    }
};

self.addEventListener('fetch', event => {
    console.log('Received fetch', event);
    // event.respondWith((async () => {
    //     const cache = await caches.open(CACHE_NAME);
    //
    //     // Get the resource from the cache.
    //     const cachedResponse = await cache.match(event.request);
    //     if (cachedResponse) {
    //         return cachedResponse;
    //     } else {
    //         try {
    //             // If the resource was not in the cache, try the network.
    //             const fetchResponse = await fetch(event.request);
    //
    //             // Save the resource in the cache and return it.
    //             cache.put(event.request, fetchResponse.clone());
    //             return fetchResponse;
    //         } catch (e) {
    //             // The network failed.
    //         }
    //     }
    // })());
});
