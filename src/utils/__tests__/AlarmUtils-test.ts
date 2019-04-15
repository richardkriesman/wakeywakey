import { Schedule } from "../../models";
import { Alarm, AlarmDay } from "../../models/Alarm";
import AlarmUtils from "../AlarmUtils";
import { TestEnvironment } from "../testing";
import { Time } from "../Time";

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            done();
        });
});

describe("alarm formatting", () => {

    const days: number = AlarmDay.Monday | AlarmDay.Wednesday | AlarmDay.Friday; // MWF
    const sleepTime: Time = Time.createFromDisplayTime(22, 0);      // 22:00
    const wakeTime: Time = Time.createFromDisplayTime(7, 0);        // 07:00
    const getUpTime: Time = Time.createFromDisplayTime(8, 0);       // 08:00

    let alarm: Alarm;
    let schedule: Schedule;

    beforeEach((done) => {

        // create new alarm and schedule for each test
        // FIXME: Create a mock database and a
        Schedule.create(env.db, "Test schedule")
            .then((value) => {
                schedule = value;
                return Alarm.create(env.db, schedule.id, sleepTime, wakeTime, getUpTime, days);
            })
            .then((value) => {
                alarm = value;
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

    // Wed Mar 27 2019 15:00:30 CDT
    const dateTimeMillis: number = 1553716830510;

    beforeEach(() => {
        env.timing.date = dateTimeMillis;
    });

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
