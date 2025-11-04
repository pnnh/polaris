'use client'

import {entries, set, get} from 'idb-keyval';

export interface IChannelEntry {
    name: string;
}

export async function clientLoadChannelEntries() {
    const allEntries = await entries();
    console.log('All entries:', allEntries);

    const dirEntries: IChannelEntry[] = [];
    allEntries.forEach(([key, value]) => {
        console.log(`Key: ${key}, Value:`, value);
        const strKey = key.toString()
        if (strKey.startsWith('channel-')) {
            dirEntries.push({name: strKey.substring('channel-'.length)});
        }
    });
    return dirEntries;
}
