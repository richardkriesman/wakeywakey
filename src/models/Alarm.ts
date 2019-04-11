import { AppDatabase } from "../utils/AppDatabase";
import { Model } from "../utils/Model";
import { Schedule } from "./Schedule";

export enum AlarmDay {
    Monday = 0,
    Tuesday = 1,
    Wednesday = 2,
    Thursday = 3,
    Friday = 4,
    Saturday = 5,
    Sunday = 6
}

/**
 * An Alarm specifies the times go to bed or get up. It can be repeated over a specified number of days.
 *
 * Alarms have 3 event times:
 *  - Sleep:   The time the child should to go to sleep
 *  - Wake up: The time the child should wake up
 *  - Get up:  The time the child is allowed to get up
 *
 *  When an event time is reached and the Alarm's parent Schedule is enabled, the alarm sound as specified in the
 *  Schedule will be played.
 *
 *  A Schedule can have multiple alarms, but only such that no two Alarms are assigned to any day.
 */
export class Alarm extends Model {

    /**
     * Creates a new Alarm.
     *
     * For internal use only. Use a {@link Schedule} to create a new alarm from the UI.
     *
     * @param db Database connection
     * @param schedule Schedule by which this alarm is attached
     * @param sleepTime Time the child should go to sleep
     * @param wakeTime Time the child should wake up
     * @param getUpTime Time the child is allowed to get up
     * @param days Days of the week the Alarm is active for
     */
    public static async create(db: AppDatabase, schedule: Schedule, sleepTime: number, wakeTime: number,
                               getUpTime: number, days: AlarmDay[]): Promise<Alarm> {

        // insert the alarm into the database
        const result: SQLResultSet = await db.execute(`
            INSERT INTO alarm
                (scheduleId, sleepTime, wakeTime, getUpTime)
            VALUES
                (?, ?, ?, ?)
        `, [schedule.id, sleepTime, wakeTime, getUpTime]);

        // TODO: Add days of week

        // build the resulting model
        return Alarm.load(db, schedule, {
            getUpTime,
            id: result.insertId,
            scheduleId: schedule.id,
            sleepTime,
            wakeTime
        });
    }

    /**
     * Generates a model given a row from the database.
     *
     * @param db Database connection
     * @param schedule Schedule to which this Alarm is attached
     * @param row Row from the database
     */
    private static load(db: AppDatabase, schedule: Schedule, row: any): Alarm {
        const model = new Alarm(db, schedule);
        model._id = row.id;
        model._sleepTime = row.sleepTime;
        model._wakeTime = row.wakeTime;
        model._getUpTime = row.getUpTime;
        return model;
    }

    /**
     * A {@link Schedule} to which this Alarm is attached.
     */
    public readonly schedule: Schedule;

    private _id: number;
    private _sleepTime: number;
    private _wakeTime: number;
    private _getUpTime: number;

    private constructor(db: AppDatabase, schedule: Schedule) {
        super(db);
        this.schedule = schedule;
    }

    /**
     * A unique ID
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Time the child should go to sleep as the number of seconds from the start of the day.
     */
    public get sleepTime(): number {
        return this._sleepTime;
    }

    /**
     * Time the child should wake up as the number of seconds from the start of the day.
     */
    public get wakeTime(): number {
        return this._wakeTime;
    }

    /**
     * Time the child is allowed to get up as the number of seconds from the start of the day.
     */
    public get getUpTime(): number {
        return this._getUpTime;
    }

    /**
     * Deletes the Alarm.
     *
     * Do not use this Alarm after it has been deleted.
     */
    public async delete(): Promise<void> {
        await this.db.execute(`
            DELETE FROM alarm
            WHERE
                id = ?
        `, [this.id]);
    }

}
