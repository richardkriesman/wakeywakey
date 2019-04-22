/**
 * @module utils
 */

import {Alarm, AlarmDay} from "../models/Alarm";
import {Time} from "./Time";

export function getAlarmTitle(alarm: Alarm): string {
    console.log("we're here");
    const start = formatTime(alarm.sleepTime);
    const end = formatTime(alarm.getUpTime);
    return `${start} - ${end}`;
}

export function getAlarmSubtitle(alarm: Alarm): string {
    const displayDays: string[] = [];
    if (alarm.isDayActive(AlarmDay.Monday)) {
        displayDays.push("M");
    }
    if (alarm.isDayActive(AlarmDay.Tuesday)) {
        displayDays.push("Tu");
    }
    if (alarm.isDayActive(AlarmDay.Wednesday)) {
        displayDays.push("W");
    }
    if (alarm.isDayActive(AlarmDay.Thursday)) {
        displayDays.push("Th");
    }
    if (alarm.isDayActive(AlarmDay.Friday)) {
        displayDays.push("F");
    }
    if (alarm.isDayActive(AlarmDay.Saturday)) {
        displayDays.push("Sa");
    }
    if (alarm.isDayActive(AlarmDay.Sunday)) {
        displayDays.push("Su");
    }
    return displayDays.join(", ");
}

export function formatTime(time: Time): string {
    return time ? `${padTime(time.hour)}:${padTime(time.minute)}` : "";
}

export function padTime(time: number): string {
    return ("0" + time).slice(-2);
}

const AlarmUtils = {
    formatTime,
    getAlarmSubtitle,
    getAlarmTitle,
    padTime
};

export default AlarmUtils;
