// Use the install event to pre-cache all initial resources.
import {clientConsoleSelectLibraries} from "@/components/client/libraries/library";

import {entries, set, get} from 'idb-keyval';
import {clientGetDirectoryEntry, clientSyncLibraryFiles, ILibraryEntry} from "@/components/client/images/service";

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
            selectResult.range.forEach((model) => {
                console.log('Library:', model.name, model.title);
                const entryKey = `library-${model.name}`;
                const libEntry: ILibraryEntry = {
                    key: entryKey,
                    name: model.name,
                    isLocal: false,
                    libType: model.header,
                }
                set(entryKey, libEntry).then(() => {
                    console.log(`Stored library entry in IndexedDB with key: ${entryKey}`);
                }).catch((err) => {
                    console.error(`Failed to store library entry ${entryKey}:`, err);
                });
            })
        }
        if (event.source) {
            event.source.postMessage({dbId: 'my-db', ready: true});
        }
    } else if (type === 'SYNC_IMAGE_LIBRARY') {
        const {libName} = data;
        console.log('Sync image library request received for portal:', portalUrl);
        if (!libName) {
            console.warn('No library name provided for image library sync.');
            return;
        }
        const dirEntry = await clientGetDirectoryEntry(libName)
        if (!dirEntry || !dirEntry.hasPermission) {
            console.warn('No permission to access the image library directory.');
            return;
        }
        const dirFiles = await clientSyncLibraryFiles(dirEntry)
        if (!dirFiles || dirFiles.length === 0) {
            console.warn('No files found in the image library directory.');
            return;
        }
        console.log(`Loaded ${dirFiles.length} files from image library ${libName}.`);
        dirFiles.forEach(dir => {
            const entryKey = `image-${libName}-${dir.name}`;
            const entryValue = {
                name: dir.name,
                handle: dir.handle,
            }
            set(entryKey, entryValue).then(() => {
                console.log(`Stored image entry in IndexedDB with key: ${entryKey}`);
            }).catch(() => {
                console.error(`Failed to store image entry ${entryKey}`);
            })
        })
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
