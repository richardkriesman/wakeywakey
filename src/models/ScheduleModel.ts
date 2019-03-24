import { ScheduleListItem } from "../components/MainSettingsScreen/ScheduleListItem";
import { AlarmModel } from "./AlarmModel";

export interface ScheduleModel {
    alarms: AlarmModel[];
    enabled: boolean;
    key: number;
    name: string;

    // DO NOT SERIALIZE ANYTHING BELOW THIS LINE
    listItemRef?: ScheduleListItem;
}
