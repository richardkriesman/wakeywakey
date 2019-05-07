/**
 * @module services
 */

import { Schedule } from "../models";
import { ScheduleClockStyle, ScheduleColors } from "../models/Schedule";
import { AlarmAudio } from "../utils/Audio";
import { Service } from "../utils/service/Service";
import { ServiceName } from "../utils/service/ServiceOptions";
import { Emitter, Watcher } from "../utils/watcher";

@ServiceName("ScheduleService")
export class ScheduleService extends Service {

    /**
     * Creates a new {@link Schedule}.
     *
     * @param name Non-unique name for the schedule
     */
    public async create(name: string): Promise<Schedule> {

        // insert the schedule into the database
        const result: SQLResultSet = await this.db.execute(`
            INSERT INTO schedule
                (name, isEnabled, audio, colorScheme, maximumSnooze, clockStyle)
            VALUES
                (?, 0, 0, 4, 5, 0)
        `, [name]);

        // update the emitters
        this.db.getEmitterSet<Schedule>(ScheduleService).update(await this.getAll());

        // build the resulting model
        return Schedule.load(this.db, {
            audio: 0,
            clockStyle: 0,
            colorScheme: 0,
            id: result.insertId,
            isEnabled: false,
            maximumSnooze: 5,
            name
        });
    }

    /**
     * Deletes a {@link Schedule}. All associated alarms and options will also be deleted.
     *
     * Do not use the Schedule after it has been deleted.
     *
     * @param schedule Schedule to be deleted
     */
    public async delete(schedule: Schedule): Promise<void> {
        await this.db.execute(`
            DELETE FROM schedule
            WHERE
                id = ?
        `, [schedule.id]);
        this.db.getEmitterSet<Schedule>(ScheduleService).update(await this.getAll());
    }

    /**
     * Gets a {@link Schedule} by its ID.
     *
     * @param id ID of the Schedule
     */
    public async get(id: number): Promise<Schedule | undefined> {
        const result: SQLResultSet = await this.db.execute(`
            SELECT *
            FROM schedule
            WHERE
                id = ?
        `, [id]);
        return result.rows.length > 0 ? Schedule.load(this.db, result.rows.item(0)) : undefined;
    }

    /**
     * Gets all {@link Schedule}s.
     */
    public async getAll(): Promise<Schedule[]> {

        // get all rows in ascending order
        const result: SQLResultSet = await this.db.execute(`
            SELECT *
            FROM schedule;     
        `);

        // build models from results
        const models: Schedule[] = [];
        for (let i = 0; i < result.rows.length; i++) {
            models.push(Schedule.load(this.db, result.rows.item(i)));
        }
        return models;

    }

    /**
     * Gets the {@link Schedule} that is currently enabled, or undefined if no {@link Schedule} is enabled.
     */
    public async getEnabled(): Promise<Schedule | undefined> {
        const result: SQLResultSet = await this.db.execute(`
            SELECT *
            FROM schedule
            WHERE
                isEnabled = 1
        `);

        return result.rows.length > 0 ? Schedule.load(this.db, result.rows.item(0)) : undefined;
    }

    /**
     * Sets the sound that will play for alarms in a {@link Schedule}.
     *
     * @param schedule Schedule to set this property on
     * @param audio Audio to play
     */
    public async setAudio(schedule: Schedule, audio: AlarmAudio): Promise<void> {
        await this.db.execute(`
            UPDATE schedule
            SET
                audio = ?
            WHERE
                id = ?
        `, [audio, schedule.id]);
        this.db.getEmitterSet<Schedule>(ScheduleService).update(await this.getAll());
    }

    /**
     * Sets the clock style for a {@link Schedule}.
     *
     * @param schedule Schedule to set this property on
     * @param clockStyle Clock style
     */
    public async setClockStyle(schedule: Schedule, clockStyle: ScheduleClockStyle): Promise<void> {
        await this.db.execute(`
            UPDATE schedule
            SET
                clockStyle = ?
            WHERE
                id = ?
        `, [clockStyle, schedule.id]);
        this.db.getEmitterSet<Schedule>(ScheduleService).update(await this.getAll());
    }

    /**
     * Sets the color scheme for a {@link Schedule}.
     *
     * @param schedule Schedule to set this property on
     * @param colorScheme Color scheme
     */
    public async setColorScheme(schedule: Schedule, colorScheme: ScheduleColors): Promise<void> {
        await this.db.execute(`
            UPDATE schedule
            SET
                colorScheme = ?
            WHERE
                id = ?
        `, [colorScheme, schedule.id]);
        this.db.getEmitterSet<Schedule>(ScheduleService).update(await this.getAll());
    }

    /**
     * Enables or disables a {@link Schedule} with the given ID. Only one Schedule can be enabled at any given time, so
     * if the Schedule is being enabled, all others will be disabled.
     *
     * @param scheduleId Unique ID of the Schedule to update
     * @param isEnabled Whether the Schedule should be enabled or disabled
     */
    public async setIsEnabled(scheduleId: number, isEnabled: boolean): Promise<void> {
        await this.db.execute(`
            UPDATE schedule
            SET
                isEnabled = CASE
                    WHEN id = ? THEN ?
                    ELSE 0
                    END
        `, [scheduleId, isEnabled ? 1 : 0]);
        this.db.getEmitterSet<Schedule>(ScheduleService).update(await this.getAll());
    }

    /**
     * Sets the length of a snooze in a {@link Schedule}.
     *
     * @param schedule Schedule to set this property on
     * @param snoozeTime Snooze time in minutes
     */
    public async setSnoozeTime(schedule: Schedule, snoozeTime: number): Promise<void> {
        await this.db.execute(`
            UPDATE schedule
            SET
                maximumSnooze = ?
            WHERE
                id = ?
        `, [snoozeTime, schedule.id]);
        this.db.getEmitterSet<Schedule>(ScheduleService).update(await this.getAll());
    }

    /**
     * Returns a {@link Watcher} for all schedules.
     */
    public watchAll(): Watcher<Schedule> {
        const emitter: Emitter<Schedule> = this.db.getEmitterSet<Schedule>(ScheduleService).create();
        this.getAll() // get an initial data set
            .then((schedules: Schedule[]) => {
                emitter.updateInitialSet(schedules);
            });
        return emitter;
    }

}
