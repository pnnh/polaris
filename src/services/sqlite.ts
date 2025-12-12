// 全局sqlite实例
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

let sqlite3;
let poolUtil: any; // Or use the extended PoolUtil type above


self.onmessage = async (event) => {

    console.log('Received message', event.data);
    const {action, data} = event.data;

    if (action === 'SQLITE_INIT') {
        console.log('Initialize SQLite request received.');
        // Initialization logic for SQLite can be added here.
        sqlite3 = await sqlite3InitModule({
            print: console.log,
            printErr: console.error,
        });
        // Check for OPFS support first
        if (!('storage' in navigator) || !navigator.storage.getDirectory) {
            throw new Error('Browser does not support OPFS');
        }
        poolUtil = await sqlite3.installOpfsSAHPoolVfs({initialCapacity: 6, name: 'my-sahpool'});
        if (!sqlite3.capi.sqlite3_vfs_find('my-sahpool')) {
            throw new Error('SAH Pool VFS installation failed');
        }
        console.log('Pool capacity:', poolUtil.getCapacity());
        console.log('Allocated files:', poolUtil.getFileNames());
        const db = new poolUtil.OpfsSAHPoolDb('/myapp.db', 'c');

        // const db = new sqlite3.oo1.OpfsDb('/myapp.db', 'c');  // 'c' = create if not exists
        db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');
        db.exec({
            sql: 'INSERT INTO users (name) VALUES (?)',
            bind: ['Alice'],  // Array of bind values; supports ? placeholders
            //returnValue: 'rowsAffected'  // Optional: Returns number of affected rows (e.g., 1)
        });
        const affectedRows = db.changes();  // Returns number (e.g., 1 for single insert)
        console.log('Changed rows:', affectedRows);
        // const newId = db.lastID();          // Returns the auto-incremented ID (e.g., 1)
        // console.log(`Inserted ${affectedRows} row(s) with ID: ${newId}`);  // e.g., "Inserted 1 row(s) with ID: 1"
        const rows: any[] = [];
        const result = db.exec({
            sql: 'SELECT * FROM users',
            rowMode: 'object',  // 'array' for [id, name], 'object' for {id: 1, name: 'Alice'}
            resultRows: rows,
            returnValue: 'resultRows'  // Return the rows array instead of 'this'
        });

// Now 'result' is the rows array—traverse and print row by row
        if (result.length === 0) {
            console.log('No data in users table.');
        } else {
            console.log(`Found ${result.length} row(s):`);
            // for (const row of result) {
            //     console.log('Row:', row);  // e.g., { id: 1, name: 'Alice' }
            //     // Or print specific columns: console.log(`ID: ${row.id}, Name: ${row.name}`);
            // }
        }

        db.close();
        if (event.source) {
            event.source.postMessage({
                type: 'SQLITE_READY',
                data: {version: sqlite3.version.libVersion}
            });
        }
    }
};
