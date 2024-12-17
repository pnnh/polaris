import {openMainDatabase} from "@/services/server/localdb/sqlite";


export async function initDatabase() {
    const database = await openMainDatabase()
    await database.exec(`
        CREATE TABLE IF NOT EXISTS channels
        (
            urn TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            image TEXT
        );
        CREATE TABLE IF NOT EXISTS articles
        ( 
            urn TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            header TEXT,
            body TEXT,
            create_time TEXT,
            update_time TEXT,
            creator TEXT,
            keywords TEXT,
            description TEXT,
            cover TEXT DEFAULT '',
            discover INTEGER DEFAULT 0,
            owner TEXT,
            channel TEXT,
            partition TEXT,
            path TEXT
        );
        CREATE TABLE IF NOT EXISTS tags
        (
            urn TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            article TEXT,
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            channel TEXT
        );
    `)
}

