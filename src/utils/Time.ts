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
        if (totalSeconds < 0) {
            throw new Error("Time values cannot be negative");
        }

        const time = new Time();
        time._hour = Math.floor(totalSeconds / 3600);
        time._minute = Math.floor((totalSeconds - (time.hour * 3600)) / 60);
        time._second = Math.floor(totalSeconds - (time.hour * 3600) - (time.minute * 60));
        return time;
    }

    public static createFromDisplayTime(hour: number, minute: number, second?: number): Time {
        if (hour < 0 || minute < 0 || second < 0) {
            throw new Error("Time values cannot be negative");
        }

        const time = new Time();
        time._hour = hour;
        time._minute = minute;
        time._second = second ? second : 0;
        return time;
    }

    public static createFromDate(date: Date): Time {
        return this.createFromDisplayTime(date.getHours(), date.getMinutes(), date.getSeconds());
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

    /**
     * Returns a new Time with the number of hours, minutes, and seconds added to this Time. The new Time will properly
     * wrap around to the next day if the new Time exceeds 24 hours.
     *
     * @param hour
     * @param minute
     * @param second
     */
    public add(hour: number, minute: number = 0, second: number = 0): Time {
        const diffTime: Time = Time.createFromDisplayTime(hour, minute, second); // time delta

        // wrap around to next day if time exceeds 24 hours
        let totalSeconds: number = this.totalSeconds + diffTime.totalSeconds;
        while (totalSeconds >= 86400) { // 24 hours in seconds
            totalSeconds -= 86400;
        }

        return Time.createFromTotalSeconds(totalSeconds);
    }

    public greaterThan(rel: Time): boolean {
        return this.totalSeconds > rel.totalSeconds;
    }

    public greaterThanOrEquals(rel: Time): boolean {
        return this.totalSeconds >= rel.totalSeconds;
    }

    public equals(time: Time): boolean {
        return this.totalSeconds === time.totalSeconds;
    }

    public isInRange(minTime: Time, maxTime: Time, isInclusive: boolean = true): boolean {
        if (minTime.lessThanOrEquals(maxTime)) { // times are in the same day
            if (isInclusive) {
                return minTime.lessThanOrEquals(this) && maxTime.greaterThanOrEquals(this);
            } else {
                return minTime.lessThan(this) && maxTime.greaterThan(this);
            }
        } else { // times cross day boundary, reverse the logic
            if (isInclusive) {
                return minTime.greaterThanOrEquals(this) && maxTime.greaterThanOrEquals(this);
            } else {
                return minTime.greaterThan(this) && maxTime.greaterThan(this);
            }
        }
    }

    public lessThan(rel: Time): boolean {
        return this.totalSeconds < rel.totalSeconds;
    }

    public lessThanOrEquals(rel: Time): boolean {
        return this.totalSeconds <= rel.totalSeconds;
    }

    /**
     * Returns a new Time with the number of hours, minutes, and seconds subtracted from this Time. The new Time will
     * properly wrap around to the previous day if the new Time is less than 0 total seconds.
     *
     * A dom() function will be added later which will return a Time that is compatible with sub(). Okay, that was a
     * bad joke but I'm not sorry.
     *
     * @param hour
     * @param minute
     * @param second
     */
    public sub(hour: number, minute: number = 0, second: number = 0): Time {
        const diffTime: Time = Time.createFromDisplayTime(hour, minute, second); // time delta

        // wrap around to previous day if time is less than 0
        let totalSeconds: number = this.totalSeconds - diffTime.totalSeconds;
        while (totalSeconds < 0) {
            totalSeconds += 86400;
        }

        return Time.createFromTotalSeconds(totalSeconds);
    }
}
