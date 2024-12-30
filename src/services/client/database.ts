import {openDB, deleteDB, wrap, unwrap} from 'idb';

export async function openDatabase(name: string, version: number = 1) {
    return await openDB(name, version, {
        blocked(currentVersion: number, blockedVersion: number | null, event: IDBVersionChangeEvent) {
            console.log('blocked', currentVersion, blockedVersion, event);
        },
        upgrade(db, oldVersion, newVersion, transaction, event) {
            db.createObjectStore('keyVal');
        },
    });
}
