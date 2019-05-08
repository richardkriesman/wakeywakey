/**
 * @module utils
 */

import {Alarm, AlarmDay} from "../models/Alarm";
import {Time} from "./Time";

export function getAlarmTitle(alarm: Alarm, is24HourTime: boolean): string {
    const start = formatTime(alarm.sleepTime, is24HourTime);
    const end = formatTime(alarm.getUpTime, is24HourTime);
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

export function formatTime(time: Time, is24HourTime: boolean): string {
    if (is24HourTime) {
        return time ? `${padTime(time.hour)}:${padTime(time.minute)}` : "";
    } else {
        const normalizedHour: number = time.hour - 12;
        if (normalizedHour >= 0) { // time is PM
            return time ? `${normalizedHour}:${padTime(time.minute)} pm` : "";
        } else { // time is AM
            return time ? `${time.hour}:${padTime(time.minute)} am` : "";
        }
    }
}

/**
 * Determines whether or not an {@link Alarm} is current active today
 *
 * @param alarm Alarm to check
 */
export function isActiveToday(alarm: Alarm): boolean {

    // get day of week as a characteristic vector
    let dayOfWeek: number = (new Date()).getDay() - 1;
    if (dayOfWeek < 0) { // now.getDay() starts on sunday, but we start with monday - normalize this
        dayOfWeek = 6;
    }
    const today: number = 1 << dayOfWeek;

    return alarm.isDayActive(today);
}

export function padTime(time: number): string {
    return ("0" + time).slice(-2);
}
