import { AlarmService } from "../services/AlarmService";
import { ScheduleService } from "../services/ScheduleService";
import { AppDatabase } from "../utils/AppDatabase";
import { Model } from "../utils/Model";
import { Watcher } from "../utils/watcher/Watcher";
import { Alarm } from "./Alarm";

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
     * Generates a model given a row from the database.
     *
     * @param db Database connection
     * @param row Row from the database
     */
    public static load(db: AppDatabase, row: any): Schedule {
        const model = new Schedule(db);
        model._id = row.id;
        model._name = row.name;
        model._isEnabled = !!row.isEnabled;
        return model;
    }

    private _name: string;
    private _isEnabled: boolean;

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

    /**
     * Deletes this Schedule.
     *
     * Do not use this Schedule after it has been deleted.
     */
    public async delete(): Promise<void> {
        await this.db.getService(ScheduleService).delete(this);
    }

    /**
     * Watch {@link Alarm}s attached to this Schedule.
     */
    public watchAlarms(): Watcher<Alarm> {
        return this.db.getService(AlarmService).watchBySchedule(this);
    }

}
