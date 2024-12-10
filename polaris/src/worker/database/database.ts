import sqlite3 from 'sqlite3'
import {Database, open} from 'sqlite'
import * as process from "node:process";

const databaseMap: Map<string, Database<sqlite3.Database>> = new Map()

export async function openDatabase(filename: string): Promise<Database<sqlite3.Database>> {
    if (databaseMap.has(filename)) {
        return databaseMap.get(filename) as Database<sqlite3.Database>
    }
    const database = await open({
        filename: filename,
        driver: sqlite3.cached.Database
    })
    databaseMap.set(filename, database)
    return database
}

export async function openMainDatabase() {
    const mainDatabasePath = `${process.cwd()}/polaris.db`
    return openDatabase(mainDatabasePath)
}
