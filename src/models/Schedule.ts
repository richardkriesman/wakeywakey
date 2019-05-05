import { AlarmService } from "../services/AlarmService";
import { ScheduleService } from "../services/ScheduleService";
import { AppDatabase } from "../utils/AppDatabase";
import { Model } from "../utils/Model";
import { Watcher } from "../utils/watcher/Watcher";
import { Alarm } from "./Alarm";

export enum ScheduleColors {
    Red = 0,
    Orange = 1,
    Yellow = 2,
    Green = 3,
    Blue = 4,
    Purple = 5
}

export enum ScheduleAudio {
    MusicBox = 0,
    Birds = 1,
    PagerBeeps = 2,
    Computer = 3,
    Loud = 4,
    Normal = 5
}

export enum ScheduleClockStyle {
    Digital = 0,
    Analog = 1
}

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
        model._audio = row.audio;
        model._colorScheme = row.colorScheme;
        model._maximumSnooze = row.maximumSnooze;
        model._clockStyle = row.clockStyle;
        return model;
    }

    private _name: string;
    private _isEnabled: boolean;
    private _audio: number;
    private _colorScheme: number;
    private _maximumSnooze: number;
    private _clockStyle: number;

    public get audio(): ScheduleAudio {
        return this._audio;
    }

    public get colorScheme(): ScheduleColors {
        return this._colorScheme;
    }

    public get clockStyle(): ScheduleClockStyle {
        return this._clockStyle;
    }

    public get snoozeTime(): number {
        return this._maximumSnooze;
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

    /**
     * Deletes this Schedule.
     *
     * Do not use this Schedule after it has been deleted.
     */
    public async delete(): Promise<void> {
        await this.db.getService(ScheduleService).delete(this);
    }

    public async setAudio(audio: ScheduleAudio): Promise<void> {
        await this.db.getService(ScheduleService).setAudio(this, audio);
    }

    public async setColorScheme(colorScheme: ScheduleColors): Promise<void> {
        await this.db.getService(ScheduleService).setColorScheme(this, colorScheme);
    }

    public async setSnoozeTime(snoozeTime: number): Promise<void> {
        await this.db.getService(ScheduleService).setSnoozeTime(this, snoozeTime);
    }

    public async setClockStyle(clockStyle: ScheduleClockStyle): Promise<void> {
        await this.db.getService(ScheduleService).setClockStyle(this, clockStyle);
    }

    /**
     * Watch {@link Alarm}s attached to this Schedule.
     */
    public watchAlarms(): Watcher<Alarm> {
        return this.db.getService(AlarmService).watchBySchedule(this);
    }

}
