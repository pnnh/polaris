// Use the install event to pre-cache all initial resources.
import {clientConsoleSelectLibraries} from "@/components/client/libraries/library";

import {entries, set, get} from 'idb-keyval';
import {
    clientGetDirectoryEntry,
    clientSyncLocalImageLibraryFiles,
    IImageEntry,
    ILibraryEntry
} from "@/components/client/images/service";
import {clientConsoleSelectImages} from "@/components/client/images/http";
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

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
    if (type === 'PERIODIC_UPDATE') {
        const {portalUrl} = data;
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
        const {portalUrl} = data;
        const {libName} = data;
        console.log('Sync image library request received for portal:', portalUrl);
        if (!libName) {
            console.warn('No library name provided for image library sync.');
            return;
        }
        const dirEntry = await clientGetDirectoryEntry(libName)
        if (!dirEntry) {
            console.warn('No directory entry found for library name:', libName);
            return;
        }
        const dirFiles: IImageEntry[] = []

        if (dirEntry.isLocal) {
            if (dirEntry.hasPermission) {
                await clientSyncLocalImageLibraryFiles(dirEntry)
                if (!dirFiles || dirFiles.length === 0) {
                    console.warn('No files found in the image library directory.');
                    return;
                }
            } else {
                console.warn('No permission to access the image library directory.');
                return;
            }
        } else {
            console.warn('Remote image library sync not implemented yet.');
            const svcImages = await clientConsoleSelectImages(portalUrl, {})
            if (svcImages && svcImages.range && svcImages.range.length > 0) {
                svcImages.range.forEach(img => {
                    const imageEntry: IImageEntry = {
                        key: `image-${libName}-${img.uid}`,
                        name: img.title,
                        handle: null,
                        url: img.file_url,
                        isLocal: false,
                    }
                    dirFiles.push(imageEntry)
                })
            }
        }
        console.log(`Loaded ${dirFiles.length} files from image library ${libName}.`);
        dirFiles.forEach(model => {
            const entryKey = model.key;
            set(entryKey, model).then(() => {
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
