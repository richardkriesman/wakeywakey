export const DayNames: string[] = [ "Su", "M", "T", "W", "Th", "Fr", "Sa" ];
export enum DayOfWeek { Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday }

export interface AlarmModel {
    days: DayOfWeek[];
    sleepTime: Date;
    wakeUpTime: Date;
    getUpTime: Date;
    key: number;
}

export const TestAlarms: AlarmModel[] = [
    {
        days: [ DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday, DayOfWeek.Thursday, DayOfWeek.Friday ],
        getUpTime: new Date(),
        key: 0,
        sleepTime: new Date(),
        wakeUpTime: new Date()
    },
    {
        days: [ DayOfWeek.Sunday, DayOfWeek.Saturday ],
        getUpTime: new Date(),
        key: 1,
        sleepTime: new Date(),
        wakeUpTime: new Date()
    }
];
