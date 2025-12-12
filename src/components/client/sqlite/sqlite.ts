import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

const log = console.log;
const error = console.error;

const start = (sqlite3: any) => {
    log('SQLite version', sqlite3.version.libVersion);
    const db = new sqlite3.oo1.DB('/mydb.sqlite3', 'ct');  // 'ct' = create if not exists, temporary
    // Example: Execute queries
    db.exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT);');
    // db.exec('INSERT INTO users (name) VALUES (?);', ['Alice']);
    const r = db.exec('SELECT * FROM users;');
    log('Query result:', r);
    db.close();
};

const init = async () => {
    try {
        const sqlite3 = await sqlite3InitModule({print: log, printErr: error});
        start(sqlite3);
    } catch (e: any) {
        error('sqlite init error', e.name, e.message);
    }
};

init().then(r => {
    console.log('SQLite init');
});
