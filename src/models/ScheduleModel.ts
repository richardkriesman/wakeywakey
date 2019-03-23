import { AlarmModel } from "./AlarmModel";

export interface ScheduleModel {
    alarms: AlarmModel[];
    enabled: boolean;
    key: number;
    name: string;
}
