/**
 * @module services
 */

import { Schedule } from "../../models";
import { Alarm } from "../../models/Alarm";
import { MockRow } from "../../utils/testing/MockDatabase";
import { MockService } from "../../utils/testing/MockService";
import { Time } from "../../utils/Time";
import { Emitter, Watcher } from "../../utils/watcher";

export class AlarmService extends MockService {

    public async create(schedule: Schedule, sleepTime: Time, wakeTime: Time, getUpTime: Time,
                        days: number): Promise<Alarm> {

        // insert the alarm into the database
        const row: MockRow = this.mockDb.insert("alarm", {
            days,
            getUpTime: getUpTime.totalSeconds,
            scheduleId: schedule.id,
            sleepTime: sleepTime.totalSeconds,
            wakeTime: wakeTime.totalSeconds
        });

        // update the emitters
        this.appDb.getEmitterSet<Alarm>(AlarmService).update(await this.getAll());

        // build the resulting model
        return Alarm.load(this.appDb, row);

    }

    public async delete(alarm: Alarm): Promise<void> {
        this.mockDb.delete("alarm", Alarm.save(alarm));
        await this.appDb.getEmitterSet<Alarm>(AlarmService).update(await this.getAll());
    }

    public async get(id: number): Promise<Alarm | undefined> {
        const result: MockRow|undefined = this.mockDb.select("alarm", id);
        return result ? Alarm.load(this.appDb, result) : undefined;
    }

    public async getAll(): Promise<Alarm[]> {
        const result: MockRow[] = this.mockDb.selectAll("alarm");
        const alarms: Alarm[] = [];
        for (const row of result) {
            alarms.push(Alarm.load(this.appDb, row));
        }
        return alarms;
    }

    public async getBySchedule(schedule: Schedule): Promise<Alarm[]> {
        const result: MockRow[] = this.mockDb.selectAll("alarm");
        const alarms: Alarm[] = [];
        for (const row of result) {
            if (row.scheduleId === schedule.id) {
                alarms.push(Alarm.load(this.appDb, row));
            }
        }
        return alarms;
    }

    public async setDays(alarm: Alarm, days: number): Promise<Alarm> {
        this.mockDb.update("alarm", Alarm.save(alarm));

        await this.appDb.getEmitterSet<Alarm>(AlarmService).update(await this.getAll());

        const data: any = Alarm.save(alarm);
        data.days = days;
        return Alarm.load(this.appDb, data);
    }

    public async setGetUpTime(alarm: Alarm, time: Time): Promise<Alarm> {
        this.mockDb.update("alarm", Alarm.save(alarm));

        await this.appDb.getEmitterSet<Alarm>(AlarmService).update(await this.getAll());

        const data: any = Alarm.save(alarm);
        data.getUpTime = time.totalSeconds;
        return Alarm.load(this.appDb, data);
    }

    public async setSleepTime(alarm: Alarm, time: Time): Promise<Alarm> {
        this.mockDb.update("alarm", Alarm.save(alarm));

        await this.appDb.getEmitterSet<Alarm>(AlarmService).update(await this.getAll());

        const data: any = Alarm.save(alarm);
        data.sleepTime = time.totalSeconds;
        return Alarm.load(this.appDb, data);
    }

    public async setWakeTime(alarm: Alarm, time: Time): Promise<Alarm> {
        this.mockDb.update("alarm", Alarm.save(alarm));

        await this.appDb.getEmitterSet<Alarm>(AlarmService).update(await this.getAll());

        const data: any = Alarm.save(alarm);
        data.wakeTime = time.totalSeconds;
        return Alarm.load(this.appDb, data);
    }

    public watchBySchedule(schedule: Schedule): Watcher<Alarm> {
        const emitter: Emitter<Alarm> = this.appDb.getEmitterSet<Alarm>(AlarmService).create();

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
