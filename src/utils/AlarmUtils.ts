/**
 * @module utils
 */

import { Alarm } from "../models/Alarm";

export function getAlarmTitle(alarm: Alarm): string {
    const start = formatTime(alarm.sleepTime.totalSeconds);
    const end = formatTime(alarm.getUpTime.totalSeconds);
    return `${start} - ${end}`;
}

export function getAlarmSubtitle(alarm: Alarm): string {
    // TODO: Get the days here
    return "TBI :)";
}

export function formatTime(time: number): string {

    // build a Date representing the next time this alarm will sound.
    const date: Date = new Date();
    date.setHours(0, 0, 0, 0); // set date to midnight today
    date.setTime(date.getTime() + time * 1000); // add alarm seconds to get the correct time
    if (date.getTime() < (new Date()).getTime()) { // date has already passed, set to tomorrow
        date.setDate(date.getDate() + 1);
    }

    // format the date for display
    return `${padTime(date.getHours())}:${padTime(date.getMinutes())}`;
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
