import {openDatabase, openMainDatabase} from "@/services/server/database";
import {Database} from "sqlite";
import sqlite3 from "sqlite3";

export async function initDatabase() {
    const database = await openMainDatabase()
    await database.exec(`
        CREATE TABLE IF NOT EXISTS channels
        (
            uid TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            image TEXT,
            urn TEXT
        );
        CREATE TABLE IF NOT EXISTS images
        (
            uid TEXT PRIMARY KEY,
            urn TEXT,
            title TEXT NOT NULL,
            header TEXT,
            body TEXT,
            create_time TEXT,
            update_time TEXT,
            creator TEXT,
            keywords TEXT,
            description TEXT,
            cover TEXT,
            discover INTEGER,
            owner TEXT,
            channel TEXT,
            partition TEXT,
            path TEXT
        );
    `)
    await migrateDatabaseV1(database)
}

// 迁移旧版本数据
export async function migrateDatabaseV1(databaseCurrent: Database<sqlite3.Database>) {

    //const databaseV1 = await openDatabase(`build/polaris.1.db`)
    // TODO: 查询旧版本数据库中的数据，遍历并插入到新版本数据库中
}
