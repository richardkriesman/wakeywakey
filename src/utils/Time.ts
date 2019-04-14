export class Time {

    /**
     * Creates a new Time based on the number of seconds since midnight on any day.
     *
     * @param totalSeconds
     */
    public static createFromTotalSeconds(totalSeconds: number): Time {
        const time = new Time();
        time.totalSeconds = totalSeconds;
        return time;
    }

    /**
     * Number of hours since midnight on any day.
     */
    public hour: number;

    /**
     * Number of minutes since the last hour.
     */
    public minute: number;

    /**
     * Number of seconds since the last minute.
     */
    public second: number;

    public constructor() {
        const now = new Date();
        this.hour = now.getHours();
        this.minute = now.getMinutes();
        this.second = now.getSeconds();
    }

    /**
     * Number of seconds since midnight on any day.
     */
    public get totalSeconds(): number {
        return (this.hour * 3600) + (this.minute * 60) + this.second;
    }
    public set totalSeconds(value: number) {
        this.hour = Math.floor(value / 3600);
        this.minute = value - (this.hour * 3600) - Math.floor(this.second / 60);
        this.second = Math.floor(value - (this.hour * 3600) - (this.minute * 60));
    }

}
