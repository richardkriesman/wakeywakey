import { ScheduleService } from "../../services";
import { AppDatabase } from "../../utils/__mocks__/AppDatabase";
import { Model } from "../../utils/__mocks__/Model";
import { Time } from "../../utils/Time";
import { Emitter, Watcher } from "../../utils/watcher";
import { Alarm } from "./Alarm";

/**
 * A Schedule represents a weekly alarm schedule, such as "School Nights" for weeks when a child has to get up earlier
 * than normal to go to school.
 *
 * A Schedule contains alarms, with no more than 1 alarm assigned to each day of the week. It also contains preferences
 * specific to that schedule, such as alarm sounds and snooze limits.
 */
export class Schedule extends Model {

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
        // build the resulting model
        return this.load(db, {
            id: this.nextInsertId++,
            isEnabled: false,
            name
        });
    }

    /**
     * Deletes a Schedule.
     *
     * For internal use only. Use {@link ScheduleService} to delete a schedule from the UI.
     *
     * @param db Database connection
     * @param schedule Schedule to be deleted
     */
    public static async delete(db: AppDatabase, schedule: Schedule): Promise<void> {
        const thisIndex: number = this.mockSchedules.indexOf(schedule);
        delete this.mockSchedules[thisIndex];
    }

    /**
     * Gets all Schedules.
     *
     * For internal use only. Use {@link ScheduleService} to get all Schedules from the UI.
     *
     * @param db Database connection
     */
    public static async getAll(db: AppDatabase): Promise<Schedule[]> {
        return Array.from(this.mockSchedules);
    }

    private static mockSchedules: Schedule[] = [];

    private static nextInsertId: number = 0;

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
        this.mockSchedules.push(model);
        return model;
    }

    private _name: string;
    private _isEnabled: boolean;

    public constructor(db: AppDatabase) {
        super(db as any);
    }

    /**
     * Creates a new {@link Alarm} attached to this Schedule.
     *
     * @param sleepTime Time the child should go to sleep
     * @param wakeTime Time the child should wake up
     * @param getUpTime Time the child is allowed to get up
     * @param days Days the Alarm is active represented as a bitwise ORed integer
     */
    public createAlarm(sleepTime: Time, wakeTime: Time, getUpTime: Time, days: number): Promise<Alarm> {
        return Alarm.create(this.db, this.id, sleepTime, wakeTime, getUpTime, days);
    }

    /**
     * Returns a {@link Watcher} that updates with this Schedule's set of {@link Alarm}s.
     */
    public watchAlarms(): Watcher<Alarm> {
        const emitter: Emitter<Alarm> = this.db.getEmitterSet<Alarm>(Alarm.name).create();

        // configure filter
        emitter.onFilter((alarms: Alarm[]) => { // filter out alarms not attached to this schedule
            const newAlarms: Alarm[] = [];
            for (const alarm of alarms) {
                if (alarm.scheduleId === this.id) {
                    newAlarms.push(alarm);
                }
            }
            return newAlarms;
        });

        // get initial data set
        Alarm.getByScheduleId(this.db, this.id)
            .then((alarms: Alarm[]) => {
                emitter.updateInitialSet(alarms);
            });

        return emitter;
    }

}
