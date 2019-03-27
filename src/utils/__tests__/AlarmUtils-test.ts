import MockDate from "mockdate";
import { AlarmModel, DayOfWeek } from "../../models/AlarmModel";

import AlarmUtils from "../AlarmUtils";

describe("alarm formatting", () => {

    const testAlarmData: AlarmModel = {
        days: [ DayOfWeek.Monday, DayOfWeek.Wednesday, DayOfWeek.Friday ], // MWF
        getUpTime: new Date(1970, 0, 2, 8, 0, 0),  // 08:00
        key: 0,
        sleepTime: new Date(1970, 0, 1, 22, 0, 0), // 22:00
        wakeUpTime: new Date(1970, 0, 2, 7, 0, 0)  // 07:00
    };

    let testAlarm: AlarmModel;

    beforeEach(() => {
        // reset test alarm back to original
        testAlarm = Object.assign({}, testAlarmData) as AlarmModel;
    });

    it("formats the title correctly", () => {
        const title: string = AlarmUtils.getAlarmTitle(testAlarm);
        expect(title).toBe("22:00 - 08:00");
    });

    it("formats the subtitle correctly", () => {
        const subtitle: string = AlarmUtils.getAlarmSubtitle(testAlarm);
        expect(subtitle).toBe("M, W, F");
    });

});

describe("time formatting", () => {

    // Wed Mar 27 2019 15:00:30 CDT
    const dateTimeMillis: number = 1553716830510;

    jest.useFakeTimers();

    beforeEach(() => {
        MockDate.set(dateTimeMillis);
    });

    it("should be formatted correctly", () => {
        const time: string = AlarmUtils.formatTime(new Date());
        expect(time).toBe("15:00");
    });

    it("should be padded correctly", () => {
        const hours: number = 0;
        const minutes: number = 10;

        expect(AlarmUtils.padTime(hours)).toBe("00");
        expect(AlarmUtils.padTime(minutes)).toBe("10");
    });

});
