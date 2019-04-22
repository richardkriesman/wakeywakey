import { Schedule } from "../../models";
import { Alarm, AlarmDay } from "../../models/Alarm";
import { AlarmService, ScheduleService } from "../../services";
import AlarmUtils from "../AlarmUtils";
import { TestEnvironment } from "../testing";
import { Time } from "../Time";

jest.mock("../../services/AlarmService");
jest.mock("../../services/ScheduleService");

describe("alarm formatting", () => {

    let env: TestEnvironment;
    beforeEach((done) => {
        TestEnvironment.init()
            .then((newEnv) => {
                env = newEnv;
                done();
            });
    });

    const days: number = AlarmDay.Monday | AlarmDay.Wednesday | AlarmDay.Friday; // MWF
    const sleepTime: Time = Time.createFromDisplayTime(22, 0);      // 22:00
    const wakeTime: Time = Time.createFromDisplayTime(7, 0);        // 07:00
    const getUpTime: Time = Time.createFromDisplayTime(8, 0);       // 08:00

    let alarm: Alarm;
    let schedule: Schedule;

    beforeEach((done) => {
        env.db.getService(ScheduleService).create("Test schedule")
            .then((newSchedule) => {
                schedule = newSchedule;
                return env.db.getService(AlarmService).create(schedule, sleepTime, wakeTime, getUpTime, days);
            })
            .then((newAlarm) => {
                alarm = newAlarm;
                done();
            });
    });

    it("formats the title correctly", (done) => {
        const title: string = AlarmUtils.getAlarmTitle(alarm);
        expect(title).toBe("22:00 - 08:00");
        done();
    });

    it("formats the subtitle correctly", (done) => {
        const subtitle: string = AlarmUtils.getAlarmSubtitle(alarm);
        expect(subtitle).toBe("M, W, F");
        done();
    });

});

describe("time formatting", () => {

    let env: TestEnvironment;
    beforeEach((done) => {
        TestEnvironment.init()
            .then((newEnv) => {
                env = newEnv;
                env.timing.date = dateTimeMillis;
                done();
            });
    });

    // Wed Mar 27 2019 15:00:30 CDT
    const dateTimeMillis: number = 1553716830510;

    it("should be formatted correctly", () => {
        const time: string = AlarmUtils.formatTime(new Time());
        expect(time).toBe("15:00");
    });

    it("should be padded correctly", () => {
        const hours: number = 0;
        const minutes: number = 10;

        expect(AlarmUtils.padTime(hours)).toBe("00");
        expect(AlarmUtils.padTime(minutes)).toBe("10");
    });

});
