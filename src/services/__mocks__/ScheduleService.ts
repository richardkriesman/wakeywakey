/**
 * @module services
 */

import { Schedule } from "../../models";
import { MockRow } from "../../utils/testing/MockDatabase";
import { MockService } from "../../utils/testing/MockService";
import { Emitter, Watcher } from "../../utils/watcher";

export class ScheduleService extends MockService {

    public async create(name: string): Promise<Schedule> {

        // insert the schedule into the database
        const row: MockRow = this.mockDb.insert("schedule", {
            isEnabled: false,
            name
        });

        // update the emitters
        this.appDb.getEmitterSet<Schedule>(Schedule.name).update(await this.getAll());

        // build the resulting model
        return Schedule.load(this.appDb, row);
    }

    public async delete(schedule: Schedule): Promise<void> {
        this.mockDb.delete("schedule", schedule);
        this.appDb.getEmitterSet<Schedule>(Schedule.name).update(await this.getAll());
    }

    public async get(id: number): Promise<Schedule|undefined> {
        const result: MockRow|undefined = this.mockDb.select("alarm", id);
        return result ? Schedule.load(this.appDb, result) : undefined;
    }

    public async getAll(): Promise<Schedule[]> {
        const result: MockRow[] = this.mockDb.selectAll("alarm");
        const schedules: Schedule[] = [];
        for (const row of result) {
            schedules.push(Schedule.load(this.appDb, row));
        }
        return schedules;
    }

    public async setIsEnabled(scheduleId: number, isEnabled: boolean): Promise<void> {
        const rows: MockRow[] = this.mockDb.selectAll("schedule");
        for (const row of rows) {
            row.isEnabled = (row.id === scheduleId) ? isEnabled : row.isEnabled;
            this.mockDb.update("schedule", row);
        }
        this.appDb.getEmitterSet<Schedule>(Schedule.name).update(await this.getAll());
    }

    public async getEnabled(): Promise<Schedule | undefined> {
        const rows: MockRow[] = await this.mockDb.selectAll("schedule").filter((row: MockRow) => row.isEnabled);
        return rows.length > 0 ? Schedule.load(this.appDb, rows[0]) : undefined;
    }

    public watchAll(): Watcher<Schedule> {
        const emitter: Emitter<Schedule> = this.appDb.getEmitterSet<Schedule>(Schedule.name).create();
        this.getAll() // get an initial data set
            .then((schedules: Schedule[]) => {
                emitter.updateInitialSet(schedules);
            });
        return emitter;
    }

}
