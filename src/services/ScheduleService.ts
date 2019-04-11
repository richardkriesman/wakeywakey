import { Schedule } from "../models";
import { Service } from "../utils/Service";
import { Emitter, EmitterSet, Watcher } from "../utils/watcher";

export class ScheduleService extends Service {

    private emitters: EmitterSet<Schedule[]> = new EmitterSet<Schedule[]>(); // emitters to be updated on changes

    /**
     * Creates a new {@link Schedule}.
     *
     * @param name Non-unique name for the schedule
     */
    public async create(name: string): Promise<Schedule> {
        const model = await Schedule.create(this.db, name);
        this.updateEmitters();
        return model;
    }

    /**
     * Deletes a {@link Schedule}. All associated alarms and options will also be deleted.
     *
     * @param schedule Schedule to be deleted
     */
    public async delete(schedule: Schedule): Promise<void> {
        // noinspection TypeScriptValidateJSTypes - WebStorm thinks this is an invalid type for some reason?
        await Schedule.delete(this.db, schedule);
        this.updateEmitters();
    }

    /**
     * Gets all {@link Schedule}s.
     */
    public getAll(): Promise<Schedule[]> {
        return Schedule.getAll(this.db);
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
        this.updateEmitters();
    }

    /**
     * Returns a {@link Watcher} for all schedules.
     */
    public watchAll(): Watcher<Schedule[]> {
        const emitter = new Emitter<Schedule[]>();
        emitter.onDealloc(() => this.emitters.remove(emitter));
        this.getAll() // get an initial data set
            .then((schedules: Schedule[]) => {
                emitter.update(schedules);
                this.emitters.add(emitter);
            });
        return emitter;
    }

    /**
     * Updates the data set for all emitters.
     */
    private updateEmitters(): void {
        this.getAll().then((schedules: Schedule[]) => this.emitters.update(schedules));
    }

}
