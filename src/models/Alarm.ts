import { AppDatabase } from "../utils/AppDatabase";
import { Model } from "../utils/Model";
import { Schedule } from "./Schedule";
import { Time } from "../utils/Time";

export enum AlarmDay {
    Monday = 1,
    Tuesday = 2,
    Wednesday = 4,
    Thursday = 8,
    Friday = 16,
    Saturday = 32,
    Sunday = 64
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
     * Days are selected by using the bitwise OR operation like so:
     *     `AlarmDays.Monday | AlarmDays.Tuesday`
     *
     * For internal use only. Use a {@link Schedule} to create a new alarm from the UI.
     *
     * @param db Database connection
     * @param scheduleId ID of the Schedule to which this alarm is attached
     * @param sleepTime Time the child should go to sleep
     * @param wakeTime Time the child should wake up
     * @param getUpTime Time the child is allowed to get up
     * @param days Days of the week the Alarm is active for as an integer
     */
    public static async create(db: AppDatabase, scheduleId: number, sleepTime: Time, wakeTime: Time,
                               getUpTime: Time, days: number): Promise<Alarm> {

        // insert the alarm into the database
        const result: SQLResultSet = await db.execute(`
            INSERT INTO alarm
                (scheduleId, days, sleepTime, wakeTime, getUpTime)
            VALUES
                (?, ?, ?, ?, ?)
        `, [scheduleId, days, sleepTime.totalSeconds, wakeTime.totalSeconds, getUpTime.totalSeconds]);

        // update the watchers
        db.getEmitterSet<Alarm>(Alarm.name).update(await Alarm.getAll(db));

        // build the resulting model
        return Alarm.load(db, {
            getUpTime: getUpTime.totalSeconds,
            id: result.insertId,
            scheduleId,
            sleepTime: sleepTime.totalSeconds,
            wakeTime: wakeTime.totalSeconds
        });
    }

    /**
     * Gets all {@link Alarm}s.
     *
     * For internal use only.
     *
     * @param db Database connection
     */
    public static async getAll(db: AppDatabase): Promise<Alarm[]> {
        const result: SQLResultSet = await db.execute(`
            SELECT *
            FROM alarm;
        `);
        const alarms: Alarm[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            alarms.push(Alarm.load(db, result.rows.item(i)));
        }
        return alarms;
    }

    /**
     * Gets an {@link Alarm} by its ID.
     *
     * For internal use only.
     *
     * @param db Database connection
     * @param id ID of the Alarm to retrieve
     */
    public static async getById(db: AppDatabase, id: number): Promise<Alarm|undefined> {
        const result: SQLResultSet = await db.execute(`
            SELECT *
            FROM alarm
            WHERE
                id = ?
        `, [id]);
        return result.rows.length > 0 ? Alarm.load(db, result.rows.item(0)) : undefined;
    }

    /**
     * Gets an {@link Alarm} by its {@link Schedule}'s ID.
     *
     * For internal use only.
     *
     * @param db Database connection
     * @param scheduleId ID of the Schedule to which the Alarms are attached
     */
    public static async getByScheduleId(db: AppDatabase, scheduleId: number): Promise<Alarm[]> {
        const result: SQLResultSet = await db.execute(`
            SELECT *
            FROM alarm
            WHERE
                scheduleId = ?
        `, [scheduleId]);
        const alarms: Alarm[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            alarms.push(Alarm.load(db, result.rows.item(i)));
        }
        return alarms;
    }

    /**
     * Generates a model given a row from the database.
     *
     * @param db Database connection
     * @param row Row from the database
     */
    private static load(db: AppDatabase, row: any): Alarm {
        const model = new Alarm(db, row.scheduleId);
        model._id = row.id;
        model._days = row.days;
        model._sleepTime = Time.createFromTotalSeconds(row.sleepTime);
        model._wakeTime = Time.createFromTotalSeconds(row.wakeTime);
        model._getUpTime = Time.createFromTotalSeconds(row.getUpTime);
        return model;
    }

    /**
     * ID of the {@link Schedule} to which this Alarm is attached.
     */
    public readonly scheduleId: number;

    private _days: number;
    private _sleepTime: Time;
    private _wakeTime: Time;
    private _getUpTime: Time;

    private constructor(db: AppDatabase, scheduleId: number) {
        super(db);
        this.scheduleId = scheduleId;
    }

    /**
     * Days set as a bitwise ORed integer
     */
    public get days(): number {
        return this._days;
    }

    /**
     * Time the child should go to sleep
     */
    public get sleepTime(): Time {
        return this._sleepTime;
    }

    /**
     * Time the child should wake up
     */
    public get wakeTime(): Time {
        return this._wakeTime
    }

    /**
     * Time the child is allowed to get up
     */
    public get getUpTime(): Time {
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
        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await Alarm.getAll(this.db));
    }

    /**
     * Determines whether the Alarm is active for a given {@link AlarmDay}.
     *
     * @param day The day to test
     */
    public isDayActive(day: AlarmDay): boolean {
        return (this.days & day) !== 0;
    }

    /**
     * Sets the days the Alarm is active to the given days, represented as a bitwise ORed integer.
     *
     * @param days Days the alarm is active
     */
    public async setDays(days: number): Promise<void> {
        await this.db.execute(`
            UPDATE alarm
            SET
                days = ?
        `, [days]);
        this._days = days;
        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await Alarm.getAll(this.db));
    }

    /**
     * Sets the sleep time to a given time
     *
     * @param time The time to set
     */
    public async setSleepTime(time: Time): Promise<void> {
        await this.db.execute(`
            UPDATE alarm
            SET
                sleepTime = ?
        `, [time.totalSeconds]);
        this._sleepTime = time;
        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await Alarm.getAll(this.db));
    }

    /**
     * Sets the wake time to a given time
     *
     * @param time The time to set
     */
    public async setWakeTime(time: Time): Promise<void> {
        await this.db.execute(`
            UPDATE alarm
            SET
                wakeTime = ?
        `, [time.totalSeconds]);
        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await Alarm.getAll(this.db));
    }

    /**
     * Sets the get up time to a given time
     *
     * @param time The time to set
     */
    public async setGetUpTime(time: Time): Promise<void> {
        await this.db.execute(`
            UPDATE alarm
            SET
                getUpTime = ?
        `, [time.totalSeconds]);
        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await Alarm.getAll(this.db));
    }

}
