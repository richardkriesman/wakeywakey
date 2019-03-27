import { AlarmModel } from "../models/AlarmModel";

export function getAlarmTitle(alarm: AlarmModel): string {
    const start = formatTime(alarm.sleepTime);
    const end = formatTime(alarm.getUpTime);
    return `${start} – ${end}`;
}

export function getAlarmSubtitle(alarm: AlarmModel): string {
    return alarm.days.join(", ");
}

export function formatTime(date: Date): string {
    return `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;
}

export function padTime(time: number): string {
    return ("0" + time).slice(-2);
}

const AlarmUtils = {
    getAlarmSubtitle,
    getAlarmTitle,
    padTime
};

export default AlarmUtils;
