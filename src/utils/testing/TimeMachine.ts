import MockDate from "mockdate";
import { Time } from "../Time";

/**
 * Allows for manipulation of the system time and timers during testing.
 */
export class TimeMachine {

    /**
     * The current date for the system as the number of milliseconds since 1970-01-01 00:00:00 UTC.
     *
     * Changing this will affect components that access the system clock, such as `new Date()`.
     */
    public get date(): number {
        return new Date().getTime();
    }
    public set date(time: number) {
        MockDate.set(time);
    }

    /**
     * Advances the time forward by the specified number of milliseconds, triggering any timers that may have occurred.
     *
     * @param ms Number of milliseconds to move forward by
     */
    public forward(ms: number): void {
        jest.advanceTimersByTime(ms);
    }

    /**
     * The current time without the date component.
     *
     * Replacing this will change the system time for the current day, and will affect components that access the
     * system clock, such as `new Date()` or `new Time()`.
     */
    public get time(): Time {
        return new Time();
    }
    public set time(value: Time) {
        const date = new Date();
        date.setHours(value.hour, value.minute, value.second);
        this.date = date.getTime();
    }

}
