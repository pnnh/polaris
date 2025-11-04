'use client'

import {entries, set, get} from 'idb-keyval';

export async function clientSelectImageDirectory() {
    try {
        const dirHandle = await window.showDirectoryPicker();
        for await (const entry of dirHandle.values()) {
            console.log('selectFiles', entry.kind, entry.name);
        }

        const dirEntry: IDirectoryEntry = {
            name: dirHandle.name,
            handle: dirHandle
        }
        await set('myDirectory', dirEntry);  // Stores the handle in IndexedDB
        console.log('Directory handle saved!');
        return dirHandle
    } catch (err) {
        console.error('Error saving handle:', err);
    }
}

export interface IImageEntry {
    name: string;
    handle: any;
}

export class LoadError extends Error {

    constructor(message: string) {
        super(message);
        this.name = "LoadError";
    }

}

export async function clientVerifyFilePermission(dirEntry: IDirectoryEntry, mode: 'read' | 'readwrite' = 'readwrite'): Promise<boolean> {
    const options = {mode};
    // Check if permission was already granted
    if (await dirEntry.handle.queryPermission(options) === 'granted') {
        return true;
    }
    // Permission was denied
    return false;
}

export async function clientRequestFilePermission(dirEntry: IDirectoryEntry, mode: 'read' | 'readwrite' = 'readwrite'): Promise<boolean> {
    const options = {mode};
    // Check if permission was already granted
    if (await dirEntry.handle.queryPermission(options) === 'granted') {
        return true;
    }
    // Request permission
    if (await dirEntry.handle.requestPermission(options) === 'granted') {
        return true;
    }
    // Permission was denied
    return false;
}

export async function clientGetDirectoryEntry(libName: string) {
    // try {
    const dirEntry = await get(libName || 'myDirectory');
    if (dirEntry) {
        const dirEntryObject = dirEntry as IDirectoryEntry;
        dirEntryObject.hasPermission = await clientVerifyFilePermission(dirEntryObject);
        return dirEntryObject;
    } else {
        throw Error('No saved handle found. Prompt user to pick one.');
    }
    // } catch (err) {
    //     console.error('Error loading handle:', err);
    //     // Fallback: prompt user to pick again
    // }
}

export async function clientLoadDirectoryFiles(dirEntry: IDirectoryEntry, batchSize: number = 10) {
    try {
        // const dirEntry = await get(libName || 'myDirectory');
        if (dirEntry) {
            // Verify permission (handles may need re-granting if revoked)
            // if (await dirHandle.handle.queryPermission({mode: 'readwrite'}) === 'granted') {
            //     // Use the handle, e.g., list files
            // } else {
            //     // Re-prompt for permission if needed
            //     await dirHandle.handle.requestPermission({mode: 'readwrite'});
            // }
            // 请求权限，注意这里需要用户交互才能成功
            // await clientRequestFilePermission(dirEntry.handle, 'readwrite');

            const imgEntries: IImageEntry[] = [];
            let counter = 0;
            for await (const [name, handle] of dirEntry.handle.entries()) {
                console.log('File:', name);
                if (handle.kind === 'file') {
                    // const file = await handle.getFile();
                    // imgEntries.push({name, file});
                    imgEntries.push({name, handle: handle});
                    counter++;
                    if (counter >= batchSize) {
                        break; // Limit to batch size
                    }
                }
            }
            console.log('Directory handle loaded and accessible!');
            return imgEntries;
        } else {
            console.log('No saved handle found. Prompt user to pick one.');
        }
    } catch (err) {
        console.error('Error loading handle:', err);
        // Fallback: prompt user to pick again
    }
}

export interface IDirectoryEntry {
    name: string;
    handle: any;
    hasPermission?: boolean;
}

export async function clientLoadLibraryEntries() {
    const allEntries = await entries();
    console.log('All entries:', allEntries);

    const dirEntries: IDirectoryEntry[] = [];
    allEntries.forEach(([key, value]) => {
        console.log(`Key: ${key}, Value:`, value);
        const strKey = key.toString()
        if (strKey.startsWith('library-')) {
            dirEntries.push({name: key as string, handle: value as FileSystemHandle});
        }
    });
    return dirEntries;
}
