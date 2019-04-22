import { AlarmService } from "../services/AlarmService";
import { AppDatabase } from "../utils/AppDatabase";
import { Model } from "../utils/Model";
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
     * Generates a model given a row from the database.
     *
     * @param db Database connection
     * @param row Row from the database
     */
    public static load(db: AppDatabase, row: any): Alarm {
        const model = new Alarm(db);
        model._id = row.id;
        model._scheduleId = row.scheduleId;
        model._days = row.days;
        model._sleepTime = Time.createFromTotalSeconds(row.sleepTime);
        model._wakeTime = Time.createFromTotalSeconds(row.wakeTime);
        model._getUpTime = Time.createFromTotalSeconds(row.getUpTime);
        return model;
    }

    /**
     * Serializes an alarm {@link Alarm}.
     *
     * @param alarm Alarm to serialize
     */
    public static save(alarm: Alarm): any {
        return {
            days: alarm._days,
            getUpTime: alarm._getUpTime.totalSeconds,
            id: alarm._id,
            scheduleId: alarm._scheduleId,
            sleepTime: alarm._sleepTime.totalSeconds,
            wakeUpTime: alarm._wakeTime.totalSeconds
        };
    }

    private _days: number;
    private _scheduleId: number;
    private _sleepTime: Time;
    private _wakeTime: Time;
    private _getUpTime: Time;

    /**
     * Days set as a bitwise ORed integer
     */
    public get days(): number {
        return this._days;
    }

    /**
     * ID of the {@link Schedule} to which this Alarm is attached
     */
    public get scheduleId(): number {
        return this._scheduleId;
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
        return this._wakeTime;
    }

    /**
     * Time the child is allowed to get up
     */
    public get getUpTime(): Time {
        return this._getUpTime;
    }

    /**
     * Deletes this Alarm.
     *
     * Do not use this Alarm after it has been deleted.
     */
    public async delete(): Promise<void> {
        await this.db.getService(AlarmService).delete(this);
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
     * @param days New days
     */
    public async setDays(days: number): Promise<void> {
        await this.db.getService(AlarmService).setDays(this, days);
    }

    /**
     * @param time New get up time
     */
    public async setGetUpTime(time: Time): Promise<void> {
        await this.db.getService(AlarmService).setGetUpTime(this, time);
        this._getUpTime = time;
    }

    /**
     * @param time New sleep time
     */
    public async setSleepTime(time: Time): Promise<void> {
        await this.db.getService(AlarmService).setSleepTime(this, time);
        this._sleepTime = time;
    }

    /**
     * @param time New wake time
     */
    public async setWakeTime(time: Time): Promise<void> {
        await this.db.getService(AlarmService).setWakeTime(this, time);
        this._wakeTime = time;
    }

}
