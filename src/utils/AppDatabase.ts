/**
 * @module utils
 */

import { FileSystem, SQLite } from "expo";
import { TimerService } from "../services/TimerService";
import * as Log from "./Log";
import { Model } from "./Model";
import { Service, ServiceStaticBase } from "./service/Service";
import { EmitterSet } from "./watcher/EmitterSet";

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
            Log.info(DATABASE_LOG_TAG, 'Database table "preferences" does not exist, creating it');
            await appDb.execute(`
                CREATE TABLE preferences
                (
                    name VARCHAR not null
                        constraint preferences_pk primary key,
                    value VARCHAR not null
                )
            `);
        }

        // create schedules table
        if (!(await appDb.doesTableExist("schedule"))) {
            Log.info(DATABASE_LOG_TAG, 'Database table "schedule" does not exist, creating it');
            await appDb.execute(`
                CREATE TABLE schedule
                (
                    id INTEGER not null
                        constraint schedule_pk
                            primary key autoincrement,
                    name VARCHAR(30) not null,
                    isEnabled BOOLEAN default 0 not null,
                    audio INTEGER NOT null,
                    colorScheme INTEGER not null,
                    maximumSnooze INTEGER not null,
                    clockStyle INTEGER not null
                )
            `);
        }

        // create alarm table
        if (!(await appDb.doesTableExist("alarm"))) {
            await appDb.execute(`
                CREATE TABLE alarm
                (
                    id INTEGER not null
                        constraint alarm_pk
                            primary key autoincrement,
                    scheduleId INTEGER not null
                        constraint alarm_schedule_id_fk
                            references schedule
                                on update cascade on delete cascade,
                    days UNSIGNED INTEGER not null,
                    sleepTime UNSIGNED INTEGER not null,
                    wakeTime UNSIGNED INTEGER not null,
                    getUpTime UNSIGNED INTEGER not null
                );
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
    private services: Map<string, Service> = new Map();
    private emitters: Map<string, EmitterSet<any>> = new Map();

    private constructor() {
        this.db = SQLite.openDatabase(DATABASE_NAME);
        Log.info(DATABASE_LOG_TAG, `Opened database at ${FileSystem.documentDirectory}SQLite/${DATABASE_NAME}`);

        // start timer service
        this.getService<TimerService>(TimerService).start();
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
     * Gets an {@link EmitterSet} for the specified {@link Service}. The EmitterSet persists for the life of the
     * {@link AppDatabase}.
     *
     * @param service The {@link Service} to use.
     */
    public getEmitterSet<T extends Model>(service: new(db: AppDatabase) => any): EmitterSet<T> {
        const serviceName: string = this.getServiceName(service);
        let emitters: EmitterSet<T>|undefined = this.emitters.get(serviceName);
        if (!emitters) {
            emitters = new EmitterSet<T>();
            this.emitters.set(serviceName, emitters);
        }
        return emitters;
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
     * Gets a {@link Service}. Service instances persist for the life of the {@link AppDatabase}.
     *
     * @param service The {@link Service} class to retrieve.
     */
    public getService<T extends Service>(service: new(db: AppDatabase) => T): T {
        const serviceName: string = this.getServiceName(service);
        if (!this.services.has(serviceName)) {
            this.services.set(serviceName, new service(this));
        }
        return this.services.get(serviceName) as any;
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

                    // log the query
                    let query: DOMString = sql;
                    for (const arg of args) {
                        query = query.replace("?", arg);
                    }
                    Log.debug(DATABASE_LOG_TAG, `Query: ${query}`);

                    // resolve the promise
                    resolve(resultSet);

                }, (_, error) => { // error, reject
                    Log.error(DATABASE_LOG_TAG, `SQL Error ${error.code}: ${error.message}`);
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

    /**
     * Gets the SERVICE_NAME for a particular {@link Service}.
     *
     * @param service The Service whose name to retrieve.
     */
    private getServiceName<T extends Service>(service: new(db: AppDatabase) => T): string {
        if (!service.hasOwnProperty("SERVICE_NAME")) { // service name is not set, throw exception
            throw new Error("The Service cannot be resolved because it does not have a name set.");
        }
        return ((service as unknown) as ServiceStaticBase).SERVICE_NAME;
    }

}
