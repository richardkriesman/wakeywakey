/**
 * @module utils
 */

import {FileSystem, SQLite} from "expo";
import * as Log from "./Log";

const DATABASE_NAME: string = "app";
const DATABASE_LOG_TAG: string = "Database";

export class AppDatabase {

    public static get initCount(): number {
        return this._initCount;
    }

    /**
     * Creates and opens a connection to the app's SQLite database, creating any tables that don't exist.
     */
    public static async init(): Promise<AppDatabase> {
        const appDb = new AppDatabase();

        // create preferences table
        if (!(await appDb.doesTableExist("preferences"))) {
            console.debug(`Database table "preferences" does not exist, creating it`);
            await appDb.execute(`
                CREATE TABLE preferences
                (
                    name VARCHAR not null
                        constraint preferences_pk primary key,
                    value VARCHAR not null
                )
            `);
        }

        AppDatabase._initCount++;
        return appDb;
    }

    /**
     * Tracks the number of database initializations. Used to catch accidental re-initializations when the connection
     * is not properly passed between screens.
     */
    private static _initCount: number = 0;

    private db: Database;

    private constructor() {
        this.db = SQLite.openDatabase(DATABASE_NAME);
        Log.info(DATABASE_LOG_TAG, `Opened database at ${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`);
    }

    /**
     * Determines whether a table with the given name exists in the database.
     *
     * @param name The table name
     */
    public async doesTableExist(name: string): Promise<boolean> {
        const result: SQLResultSet = await this.execute(`
            SELECT *
            FROM sqlite_master
            WHERE
                tbl_name = ?
        `, [name]);
        return result.rows.length > 0;
    }

    /**
     * Returns the value from the key/value table. Returns `null` if no such value exists.
     *
     * Note: This should only be used for storing general preference data that would not be appropriate in a relational
     * schema. Do not use the key/value table for storing models.
     *
     * @param key Unique key identifying the key/value pair.
     */
    public async getPreference(key: string): Promise<string|null> {
        const result: SQLResultSet = await this.execute(`
            SELECT *
            FROM preferences
            WHERE
                name = ?
        `, [key]);
        if (result.rows.length > 0) {
            const value: string = result.rows.item(0).value;
            Log.info(DATABASE_LOG_TAG, `GET ${key}: ${value}`);
            return value;
        } else {
            Log.info(DATABASE_LOG_TAG, `GET ${key}: (null)`);
            return null;
        }
    }

    /**
     * Executes a SQL query against the database, returning a {@link SQLResultSet} containing the resultant rows.
     *
     * @param sql The SQL query to execute.
     * @param args An array of values to substitute for "?" placeholders in the SQL statement.
     */
    public execute(sql: DOMString, args: ObjectArray = []): Promise<SQLResultSet> {
        return new Promise<SQLResultSet>((resolve, reject) => {
            this.db.transaction((transaction) => { // wrap the query in a transaction
                transaction.executeSql(sql, args, (_, resultSet) => { // success, return result set
                    resolve(resultSet);
                }, (_, error) => { // error, reject
                    console.log(error);
                    reject(error);
                    return true;
                });
            });
        });
    }

    /**
     * Sets the value for a key in the key/value table. If a value already exists, it will be overwritten.
     *
     * Note: This should only be used for storing general preference data that would not be appropriate in a relational
     * schema. Do not use the key/value table for storing models.
     *
     * @param key Unique key
     * @param value Value to set for the key
     */
    public async setPreference(key: string, value: string): Promise<void> {
        await this.execute(`
            INSERT OR REPLACE INTO preferences
                (name, value)
            VALUES
                (?, ?);
        `, [key, value]);
        Log.info(DATABASE_LOG_TAG, `SET ${key}: ${value}`);
    }

}
