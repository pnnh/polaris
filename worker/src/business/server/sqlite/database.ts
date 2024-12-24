import sqlite3 from 'sqlite3'
import sqlite, {Database, open} from 'sqlite'

export interface ISqliteClient {
    openDatabase(): Promise<void>
    closeDatabase(): Promise<void>
    exec(sql: string, params?: {[key: string]: any}): Promise<void>
    select<T>(sql: string, params?: {[key: string]: any}): Promise<T[]>
    get<T>(sql: string, params?: {[key: string]: any}): Promise<T | undefined>
    prepare(sql: string): Promise<ISqliteStatement>
}
export interface ISqliteStatement {
    run(params: {[key: string]: any}): Promise<void>
    finalize(): Promise<void>
}

class SqliteStatement implements ISqliteStatement {
    #statement: sqlite.Statement<sqlite3.Statement>

    constructor(statement: sqlite.Statement<sqlite3.Statement>) {
        this.#statement = statement
    }

    async run(params: {[key: string]: any}) {
        await this.#statement.run(params)
    }
    async finalize() {
        return this.#statement.finalize()
    }
}

class SqliteClient implements ISqliteClient {
    #filePath: string | null = null
    #sqliteDatabase: Database<sqlite3.Database> | null = null

    constructor(filePath: string) {
        this.#filePath = filePath
    }

    async openDatabase() {
        if (this.#sqliteDatabase) {
            await this.#sqliteDatabase.close()
        }
        if (!this.#filePath) {
            throw new Error('No file path')
        }
        this.#sqliteDatabase = await open({
            filename: this.#filePath,
            driver: sqlite3.cached.Database
        })
    }
    async closeDatabase() {
        if (this.#sqliteDatabase) {
            await this.#sqliteDatabase.close()
        }
    }

    async exec(sql: string, params?: {[key: string]: any}) {
        if (!this.#sqliteDatabase) {
            throw new Error('No database')
        }
        return this.#sqliteDatabase.exec(sql)
    }

    async select<T>(sql: string, params?: {[key: string]: any}): Promise<T[]> {
        if (!this.#sqliteDatabase) {
            throw new Error('No database')
        }
        return this.#sqliteDatabase.all(sql, params)
    }

    async get<T>(sql: string, params?: {[key: string]: any}): Promise<T | undefined> {
        if (!this.#sqliteDatabase) {
            throw new Error('No database')
        }
        return this.#sqliteDatabase.get(sql, params)
    }
    async prepare(sql: string): Promise<ISqliteStatement> {
        if (!this.#sqliteDatabase) {
            throw new Error('No database')
        }
        const sqliteStatement = await this.#sqliteDatabase.prepare(sql)
        return new SqliteStatement(sqliteStatement)
    }
}

export async function openSqliteDatabase(fileName: string): Promise<ISqliteClient> {
    const sqliteClient = new SqliteClient(fileName)
    await sqliteClient.openDatabase()
    return sqliteClient
}
