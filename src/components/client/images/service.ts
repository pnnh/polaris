'use client'

import {entries, set, get} from 'idb-keyval';

export async function clientOpenImageLibrary() {

    const dirHandle = await window.showDirectoryPicker();
    for await (const entry of dirHandle.values()) {
        console.log('selectFiles', entry.kind, entry.name);
    }
    const libKey = 'library-myDirectory'
    const dirEntry: ILibraryEntry = {
        key: libKey,
        name: dirHandle.name,
        dirHandle: dirHandle,
        isLocal: true,
        libType: 'image-library',
    }
    await set(libKey, dirEntry);  // Stores the handle in IndexedDB
    console.log('Directory handle saved!');
    return dirEntry
}

export interface IImageEntry {
    key: string;
    name: string;
    handle: any;
    url?: string;
    isLocal?: boolean;
}

export async function clientVerifyFilePermission(dirEntry: ILibraryEntry, mode: 'read' | 'readwrite' = 'readwrite'): Promise<boolean> {
    const options = {mode};
    // Check if permission was already granted
    if (await dirEntry.dirHandle.queryPermission(options) === 'granted') {
        return true;
    }
    // Permission was denied
    return false;
}

export async function clientRequestFilePermission(dirEntry: ILibraryEntry, mode: 'read' | 'readwrite' = 'readwrite'): Promise<boolean> {
    if (!dirEntry.isLocal) {
        return true;
    }
    if (!dirEntry.dirHandle) {
        throw new Error('No directory handle found in the entry.');
    }
    const options = {mode};
    // Check if permission was already granted
    if (await clientVerifyFilePermission(dirEntry, mode)) {
        return true;
    }
    // Request permission
    if (await dirEntry.dirHandle.requestPermission(options) === 'granted') {
        return true;
    }
    // Permission was denied
    return false;
}

export async function clientGetDirectoryEntry(libName: string) {
    // try {
    const dirEntry = await get(libName);
    if (dirEntry) {
        const dirEntryObject = dirEntry as ILibraryEntry;
        if (dirEntryObject.isLocal) {
            dirEntryObject.hasPermission = await clientVerifyFilePermission(dirEntryObject);
        }
        return dirEntryObject;
    } else {
        throw Error('No saved handle found. Prompt user to pick one.');
    }
    // } catch (err) {
    //     console.error('Error loading handle:', err);
    //     // Fallback: prompt user to pick again
    // }
}

// 无论是本地还是远程图片库，都是从 IndexedDB 中获取图片文件列表
// 本地和远程图片库的同步逻辑在 worker 中处理
export async function clientGetImageLibraryFiles(dirEntry: ILibraryEntry, batchSize: number): Promise<IImageEntry[]> {
    const allEntries = await entries();
    console.log('All entries:', allEntries);

    const dirEntries: IImageEntry[] = [];
    allEntries.forEach(([key, value]) => {
        console.log(`Key: ${key}, Value:`, value);
        const strKey = key.toString()
        if (strKey.startsWith('image-')) {
            dirEntries.push(value as IImageEntry);
        }
    });
    return dirEntries;
}

export async function clientSyncLocalImageLibraryFiles(dirEntry: ILibraryEntry) {
    try {
        if (!dirEntry) {
            console.log('No saved handle found. Prompt user to pick one.');
            return [];
        }

        const imgEntries: IImageEntry[] = [];
        let counter = 0;
        const maxSize = 1000;
        for await (const [name, handle] of dirEntry.dirHandle.entries()) {
            console.log('File:', name);
            if (handle.kind === 'file') {
                const imgEntry: IImageEntry = {
                    key: name,
                    name,
                    handle: handle,
                    isLocal: true,
                }
                imgEntries.push(imgEntry);
                counter++;
                if (counter >= maxSize) {
                    break; // Limit to batch size
                }
            }
        }
        console.log('Directory handle loaded and accessible!');
        return imgEntries;
    } catch (err) {
        console.error('Error loading handle:', err);
        // Fallback: prompt user to pick again
    }
}

export interface ILibraryEntry {
    key: string;
    name: string;
    dirHandle?: any;
    hasPermission?: boolean;
    isLocal?: boolean;
    libType?: string;
}

export async function clientLoadLibraryEntries() {
    const allEntries = await entries();
    console.log('All entries:', allEntries);

    const dirEntries: ILibraryEntry[] = [];
    allEntries.forEach(([key, value]) => {
        console.log(`Key: ${key}, Value:`, value);
        const strKey = key.toString()
        if (strKey.startsWith('library-')) {
            dirEntries.push(value as ILibraryEntry);
        }
    });
    return dirEntries;
}
