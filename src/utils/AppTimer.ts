/**
 * @module utils
 */

/**
 * A function to execute when a {@link TimerEvent} fires.
 */
export type TimerHandler = (d?: Date) => void;

/**
 * A map to hold a list of {@link TimerHandler} functions to run when each {@link TimerEvent} fires.
 */
export type TimerHandlerMap = Map<string, TimerHandler[]>;

/**
 * Various timer-related events that can be listened for.
 */
export enum TimerEvent {
    START = "start",
    SECOND = "second",
    MINUTE = "minute",
    HOUR = "hour",
    STOP = "stop"
}

/**
 * String representation of TimerEvents. Too verbose?
 * Prevents attaching to events that will never be fired.
 */
export type TimerEventStr = "start" | "second" | "minute" | "hour" | "stop";

/**
 * Timer service: fires {@link TimerEvent}s when appropriate.
 *
 * Register a {@link TimerHandler} to listen for {@link TimerEvent}s by using {@link on}
 */
export class AppTimer {

    private static readonly INSTANCE: AppTimer = new AppTimer();

    /**
     * Retrieve the static instance of {@link AppTimer}.
     * @constructor
     */
    public static get Instance(): AppTimer {
        return AppTimer.INSTANCE;
    }

    /**
     * An instance field containing this service's {@link NodeJS.Timeout}'s ID.
     *
     * Can be undefined if no {@link NodeJS.Timeout} is scheduled for this {@TimerService} instance.
     */
    private timeout?: number = undefined;

    /**
     * The {@link Date} object representing the last time a timer tick happened.
     *
     * Updated on each tick.
     */
    private lastTick?: Date = undefined;

    /**
     * Getter for {@link NodeJS.Timeout} ID.
     *
     * Can be undefined if no {@link NodeJS.Timeout} is scheduled for this {@TimerService} instance.
     */
    public get timeoutId(): number {
        return this.timeout;
    }

    /**
     * A map to register {@link TimerEvent}s and their respective lists of {@link TimerHandler}s.
     */
    private handlers: TimerHandlerMap = new Map<TimerEvent, TimerHandler[]>();

    /**
     * Add a handler that listens for the given Timer event.
     * @param eventType A {@link TimerEvent} corresponding with the event to listen for
     * @param handler The {@link TimerHandler} to run when this event fires
     */
    public on(eventType: TimerEvent | TimerEventStr, handler: TimerHandler): void {
        let handlersArr: TimerHandler[] = this.handlers.get(eventType);
        handlersArr = handlersArr ? handlersArr : [];

        handlersArr.push(handler);

        this.handlers.set(eventType, handlersArr);
    }

    /**
     * Start this {@link AppTimer} instance.
     */
    public start() {
        console.log("starting AppTimer");
        this.fireAll(TimerEvent.START);
        this.step();
    }

    /**
     * Stop this {@link AppTimer} instance and clear its {@link NodeJS.Timeout}, if defined.
     */
    public stop() {
        console.log("stopping AppTimer");
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }

        this.fireAll(TimerEvent.STOP);
    }

    /**
     * Run all {@link TimerHandler} functions registered to this {@link TimerEvent}.
     * @param event The {@link TimerEvent} to fire all events for
     * @param date The {@link Date} to pass along to each handler
     */
    private fireAll(event: TimerEvent, date?: Date) {
        const handlersArr = this.handlers.get(event);

        // bail out if no handlers are registered
        if (!handlersArr) {
            return;
        }

        handlersArr.forEach((h: TimerHandler) => {
            h(date);
        });
    }

    /**
     * Handles a tick and schedules the next one using {@link scheduleNext}.
     */
    private step(fire?: boolean): void {
        const now: Date = new Date();

        if (fire && this.lastTick) {
            // fire events for this second
            this.fireAll(TimerEvent.SECOND, now);

            // fire minute event if minute has rolled over
            if (now.getMinutes() !== this.lastTick.getMinutes()) {
                this.fireAll(TimerEvent.MINUTE, now);
            }

            // fire hour event if hour has rolled over
            if (now.getHours() !== this.lastTick.getHours()) {
                this.fireAll(TimerEvent.HOUR, now);
            }
        }

        // update lastTick and schedule next step
        this.lastTick = now;
        this.scheduleNext();
    }

    /**
     * Schedule the next tick to fire when the next second rolls over.
     */
    private scheduleNext(): void {
        const now = new Date();
        const msUntilNextSecond: number = Math.min(1000, 1000 - now.getMilliseconds());
        this.timeout = setTimeout(this.step.bind(this, true), msUntilNextSecond);
    }

}

export default (() => AppTimer.Instance)();
