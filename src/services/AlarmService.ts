/**
 * @module services
 */

import { Alarm } from "../models/Alarm";
import { Schedule } from "../models/Schedule";
import { Service } from "../utils/Service";
import { Time } from "../utils/Time";
import { Emitter } from "../utils/watcher/Emitter";
import { Watcher } from "../utils/watcher/Watcher";

export class AlarmService extends Service {

    /**
     * Creates a new Alarm.
     *
     * Days are selected by using the bitwise OR operation like so:
     *     `AlarmDays.Monday | AlarmDays.Tuesday`
     *
     * @param schedule Schedule to which this alarm is attached
     * @param sleepTime Time the child should go to sleep
     * @param wakeTime Time the child should wake up
     * @param getUpTime Time the child is allowed to get up
     * @param days Days of the week the Alarm is active for as an integer
     */
    public async create(schedule: Schedule, sleepTime: Time, wakeTime: Time, getUpTime: Time,
                        days: number): Promise<Alarm> {

        // insert the alarm into the database
        const result: SQLResultSet = await this.db.execute(`
            INSERT INTO alarm
                (scheduleId, days, sleepTime, wakeTime, getUpTime)
            VALUES
                (?, ?, ?, ?, ?)
        `, [schedule.id, days, sleepTime.totalSeconds, wakeTime.totalSeconds, getUpTime.totalSeconds]);

        // update the emitters
        this.db.getEmitterSet<Alarm>(Alarm.name).update(await this.getAll());

        // build the resulting model
        return Alarm.load(this.db, {
            getUpTime: getUpTime.totalSeconds,
            id: result.insertId,
            schedule,
            sleepTime: sleepTime.totalSeconds,
            wakeTime: wakeTime.totalSeconds
        });

    }

    /**
     * Deletes the Alarm.
     *
     * Do not use the Alarm after it has been deleted.
     */
    public async delete(alarm: Alarm): Promise<void> {
        await this.db.execute(`
            DELETE FROM alarm
            WHERE
                id = ?
        `, [alarm.id]);
        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await this.getAll());
    }

    /**
     * Gets an {@link Alarm} by its ID.
     *
     * @param id ID of the Alarm to retrieve
     */
    public async get(id: number): Promise<Alarm | undefined> {
        const result: SQLResultSet = await this.db.execute(`
            SELECT *
            FROM alarm
            WHERE
                id = ?
        `, [id]);
        return result.rows.length > 0 ? Alarm.load(this.db, result.rows.item(0)) : undefined;
    }

    /**
     * Gets all {@link Alarm}s for all {@link Schedule}s.
     */
    public async getAll(): Promise<Alarm[]> {
        const result: SQLResultSet = await this.db.execute(`
            SELECT *
            FROM alarm;
        `);
        const alarms: Alarm[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            alarms.push(Alarm.load(this.db, result.rows.item(i)));
        }
        return alarms;
    }

    /**
     * Gets {@link Alarm}s for a {@link Schedule}.
     *
     * @param schedule Schedule to which the Alarms are attached
     */
    public async getBySchedule(schedule: Schedule): Promise<Alarm[]> {
        const result: SQLResultSet = await this.db.execute(`
            SELECT *
            FROM alarm
            WHERE
                scheduleId = ?
        `, [schedule.id]);
        const alarms: Alarm[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            alarms.push(Alarm.load(this.db, result.rows.item(i)));
        }
        return alarms;
    }

    /**
     * Updates the days the {@link Alarm} is active.
     *
     * @param alarm Alarm to update
     * @param days New days the Alarm should be active
     */
    public async setDays(alarm: Alarm, days: number): Promise<Alarm> {
        await this.db.execute(`
            UPDATE alarm
            SET
                days = ?
            WHERE
                id = ?
        `, [days, alarm.id]);

        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await this.getAll());

        const data: any = Alarm.save(alarm);
        data.days = days;
        return Alarm.load(this.db, data);
    }

    /**
     * Updates the get up time for the {@link Alarm}.
     *
     * @param alarm Alarm to update
     * @param time New get up time
     */
    public async setGetUpTime(alarm: Alarm, time: Time): Promise<Alarm> {
        await this.db.execute(`
            UPDATE alarm
            SET
                getUpTime = ?
            WHERE
                id = ?
        `, [time.totalSeconds, alarm.id]);

        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await this.getAll());

        const data: any = Alarm.save(alarm);
        data.getUpTime = time.totalSeconds;
        return Alarm.load(this.db, data);
    }

    /**
     * Updates the sleep time for the {@link Alarm}.
     *
     * @param alarm Alarm to update
     * @param time New sleep time
     */
    public async setSleepTime(alarm: Alarm, time: Time): Promise<Alarm> {
        await this.db.execute(`
            UPDATE alarm
            SET
                sleepTime = ?
            WHERE
                id = ?
        `, [time.totalSeconds, alarm.id]);

        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await this.getAll());

        const data: any = Alarm.save(alarm);
        data.sleepTime = time.totalSeconds;
        return Alarm.load(this.db, data);
    }

    /**
     * Updates the wake time for the {@link Alarm}.
     *
     * @param alarm Alarm to update
     * @param time New wake time
     */
    public async setWakeTime(alarm: Alarm, time: Time): Promise<Alarm> {
        await this.db.execute(`
            UPDATE alarm
            SET
                wakeTime = ?
            WHERE
                id = ?
        `, [time.totalSeconds, alarm.id]);

        await this.db.getEmitterSet<Alarm>(Alarm.name).update(await this.getAll());

        const data: any = Alarm.save(alarm);
        data.wakeTime = time.totalSeconds;
        return Alarm.load(this.db, data);
    }

    /**
     * Watch all {@link Alarm}s attached to the given {@link Schedule}.
     *
     * @param schedule Schedule whose Alarms to watch
     */
    public watchBySchedule(schedule: Schedule): Watcher<Alarm> {
        const emitter: Emitter<Alarm> = this.db.getEmitterSet<Alarm>(Alarm.name).create();

        // configure filter
        emitter.onFilter((alarms: Alarm[]) => { // filter out alarms not attached to this schedule
            const newAlarms: Alarm[] = [];
            for (const alarm of alarms) {
                if (alarm.scheduleId === schedule.id) {
                    newAlarms.push(alarm);
                }
            }
            return newAlarms;
        });

        // get initial data set
        this.getBySchedule(schedule)
            .then((alarms: Alarm[]) => {
                emitter.updateInitialSet(alarms);
            });

        return emitter;
    }

}
