/**
 * An immutable representation of the current time of any day.
 */
export class Time {

    /**
     * Creates a new Time based on the number of seconds since midnight on any day.
     *
     * @param totalSeconds
     */
    public static createFromTotalSeconds(totalSeconds: number): Time {
        const time = new Time();
        time._hour = Math.floor(totalSeconds / 3600);
        time._minute = Math.floor((totalSeconds - (time.hour * 3600)) / 60);
        time._second = Math.floor(totalSeconds - (time.hour * 3600) - (time.minute * 60));
        return time;
    }

    public static createFromDisplayTime(hour: number, minute: number, second?: number): Time {
        const time = new Time();
        time._hour = hour;
        time._minute = minute;
        time._second = second ? second : 0;
        return time;
    }

    private _hour: number;
    private _minute: number;
    private _second: number;

    public constructor() {
        const now = new Date();
        this._hour = now.getHours();
        this._minute = now.getMinutes();
        this._second = now.getSeconds();
    }

    /**
     * Number of hours since midnight on any day.
     */
    public get hour(): number {
        return this._hour;
    }

    /**
     * Number of minutes since the last hour.
     */
    public get minute(): number {
        return this._minute;
    }

    /**
     * Number of seconds since the last minute.
     */
    public get second(): number {
        return this._second;
    }

    /**
     * Number of seconds since midnight on any day.
     */
    public get totalSeconds(): number {
        return (this.hour * 3600) + (this.minute * 60) + this.second;
    }

    public equals(time: Time): boolean {
        return this.totalSeconds === time.totalSeconds;
    }

}
