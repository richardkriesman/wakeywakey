import { AppDatabase } from "../utils/AppDatabase";
import { Model } from "../utils/Model";

/**
 * A Schedule represents a weekly alarm schedule, such as "School Nights" for weeks when a child has to get up earlier
 * than normal to go to school.
 *
 * A Schedule contains alarms, with no more than 1 alarm assigned to each day of the week. It also contains preferences
 * specific to that schedule, such as alarm sounds and snooze limits.
 */
export class Schedule extends Model {

    public static readonly NAME_MAX_LENGTH: number = 30;

    /**
     * Creates a new Schedule.
     *
     * For internal use only. Use {@link ScheduleService} to create a new schedule from the UI.
     *
     * @param db Database connection
     * @param name Non-unique name for the schedule
     */
    public static async create(db: AppDatabase, name: string): Promise<Schedule> {

        // insert the schedule into the database
        const result: SQLResultSet = await db.execute(`
            INSERT INTO schedule
                (name, isEnabled)
            VALUES
                (?, 0)
        `, [name]);

        // build the resulting model
        return Schedule.load(db, {
            id: result.insertId,
            isEnabled: false,
            name
        });
    }

    /**
     * Gets all Schedules.
     *
     * For internal use only. Use {@link ScheduleService} to get all Schedules from the UI.
     *
     * @param db Database connection
     */
    public static async getAll(db: AppDatabase): Promise<Schedule[]> {

        // get all rows in ascending order
        const result: SQLResultSet = await db.execute(`
            SELECT *
            FROM schedule;     
        `);

        // build models from results
        const models: Schedule[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            models.push(Schedule.load(db, result.rows.item(i)));
        }
        return models;
    }

    /**
     * Generates a model given a row from the database.
     *
     * @param db Database connection
     * @param row Row from the database
     */
    private static load(db: AppDatabase, row: any): Schedule {
        const model = new Schedule(db);
        model._id = row.id;
        model._name = row.name;
        model._isEnabled = !!row.isEnabled;
        return model;
    }

    private _id: number;
    private _name: string;
    private _isEnabled: boolean;

    /**
     * A unique ID
     */
    public get id(): number {
        return this._id;
    }

    /**
     * A non-unique, user-friendly name
     */
    public get name(): string {
        return this._name;
    }

    /**
     * Whether the Schedule is enabled. Only one Schedule can be enabled at a time.
     */
    public get isEnabled(): boolean {
        return this._isEnabled;
    }

}
