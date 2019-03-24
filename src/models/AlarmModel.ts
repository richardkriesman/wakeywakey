export enum DayOfWeek {
    Monday = "M",
    Tuesday = "Tu",
    Wednesday = "W",
    Thursday = "Th",
    Friday = "F",
    Saturday = "Sat",
    Sunday = "Su"
}

export interface AlarmModel {
    days: DayOfWeek[];
    sleepTime: Date;
    wakeUpTime: Date;
    getUpTime: Date;
    key: number;
}

function dateFromUnixSeconds(sec: number): Date {
    const result: Date = new Date(1970, 0, 1);
    result.setSeconds(sec);
    return result;
}

export const TestAlarms: AlarmModel[] = [
    {
        days: [ DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday ],
        getUpTime: dateFromUnixSeconds(1553324400),
        key: 0,
        sleepTime: dateFromUnixSeconds(1553284800),
        wakeUpTime: dateFromUnixSeconds(1553320800)
    },
    {
        days: [ DayOfWeek.Sunday, DayOfWeek.Saturday ],
        getUpTime: dateFromUnixSeconds(1553324400),
        key: 1,
        sleepTime: dateFromUnixSeconds(1553284800),
        wakeUpTime: dateFromUnixSeconds(1553320800)
    }
];
