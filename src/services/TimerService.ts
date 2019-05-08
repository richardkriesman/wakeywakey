/**
 * @module utils
 */
import { Alarm } from "../models/Alarm";
import { Schedule } from "../models/Schedule";
import { AlarmEvent, AlarmEventType } from "../utils/AlarmEvent";
import * as AlarmUtils from "../utils/AlarmUtils";
import * as Log from "../utils/Log";
import { getEnumKeyByValue } from "../utils/ObjectUtils";
import { Service } from "../utils/service/Service";
import { ServiceName } from "../utils/service/ServiceOptions";
import { Time } from "../utils/Time";
import { AlarmService } from "./AlarmService";
import { ScheduleService } from "./ScheduleService";

const TIMER_LOG_TAG: string = "AppTimer";

/** A function to execute when a {@link TimerEvent} fires. */
export type TimerHandler = (d?: Date, ev?: AlarmEvent) => void;

/** A map to hold a list of {@link TimerHandler} functions to run when each {@link TimerEvent} fires. */
export type TimerHandlerMap = Map<string, TimerHandler[]>;

/** Various timer-related events that can be listened for. */
export enum TimerEvent {
    START = "start",
    SECOND = "second",
    MINUTE = "minute",
    HOUR = "hour",
    STOP = "stop",
    ALARM = "alarm"
}

/** String representation of TimerEvents. Prevents attaching to events that will never be fired. */
export type TimerEventStr = "start" | "second" | "minute" | "hour" | "stop" | "alarm";

/**
 * Timer service: fires {@link TimerEvent}s when appropriate.
 *
 * Register a {@link TimerHandler} to listen for {@link TimerEvent}s by using {@link on}
 */
@ServiceName("TimerService")
export class TimerService extends Service {

    /**
     * Getter for {@link NodeJS.Timeout} ID.
     *
     * Can be undefined if no {@link NodeJS.Timeout} is scheduled for this {@TimerService} instance.
     */
    public get timeoutId(): number {
        return this.timeout;
    }

    /**
     * Convert the {@link Alarm} {@link Time}s to a {@link Map}.
     *
     * @param alarm The {@link Alarm} whose {@link Time}s we are dealing with.
     */
    private static alarmTimesAsMap(alarm: Alarm): Map<AlarmEventType, Time> {
        return new Map<AlarmEventType, Time>([
            [ AlarmEventType.Sleep, alarm.sleepTime ],
            [ AlarmEventType.Wake, alarm.wakeTime ],
            [ AlarmEventType.GetUp, alarm.getUpTime ]
        ]);
    }

    /**
     * The snoozed {@link AlarmEvent}.
     */
    private snoozedEvent?: AlarmEvent;

    /**
     * The number of minutes remaining before the snoozed {@link AlarmEvent} should be replayed.
     *
     * Can be undefined if no AlarmEvent is currently snoozed.
     */
    private snoozeTime?: number = 0;

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
     * A map to register {@link TimerEvent}s and their respective lists of {@link TimerHandler}s.
     */
    private handlers: TimerHandlerMap = new Map<TimerEvent, TimerHandler[]>();

    /**
     * Cancel any snoozed {@link AlarmEvent}.
     */
    public cancelSnooze(): void {
        this.snoozedEvent = undefined;
        this.snoozeTime = undefined;
    }

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
     * Start this {@link TimerService} instance.
     */
    public start() {
        Log.info(TIMER_LOG_TAG, "Starting AppTimer");
        this.fireAll(TimerEvent.START);

        // register alarm checker on each minute
        this.on("minute", this.checkActiveAlarms.bind(this));

        // actually start the timer with the first step
        this.step();
    }

    /**
     * Stop this {@link TimerService} instance and clear its {@link NodeJS.Timeout}, if defined.
     */
    public stop() {
        Log.info(TIMER_LOG_TAG, "Stopping AppTimer");
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
     * @param alarmEvent An optional {@link AlarmEvent} to pass along to each handler, if appropriate
     */
    private fireAll(event: TimerEvent, date?: Date, alarmEvent?: AlarmEvent) {
        if (alarmEvent) { // log when alarms are fired
            const eventName: string = getEnumKeyByValue(AlarmEventType, alarmEvent.type);
            Log.info("TimerService",
                `Firing ${eventName} event for Alarm ${alarmEvent.alarm.id}`);
        }

        const handlersArr = this.handlers.get(event);

        // bail out if no handlers are registered
        if (!handlersArr) {
            return;
        }

        // fire each event
        handlersArr.forEach((h: TimerHandler) => {
            h(date, alarmEvent);
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

    /**
     * Check active alarms and see whether we need to fire any of them.
     */
    private async checkActiveAlarms(now: Date): Promise<void> {
        Log.info("TimerService", "Checking for new alarms");

        // check if there's any snoozed event to replay
        if (this.snoozedEvent) {
            this.snoozeTime--;
            if (this.snoozeTime <= 0) { // snooze is up, replay event
                this.fireAll(TimerEvent.ALARM, now, this.snoozedEvent);
                this.snoozedEvent = undefined;
                this.snoozeTime = undefined;
            }
        }

        // check for any new alarms to fire
        const alarms: Alarm[] = await this.fetchActiveAlarms();
        alarms.forEach(this.checkAlarm.bind(this, now));
    }

    /**
     * Check to see whether this alarm needs to be fired, and fire the alarm if so.
     *
     * @param now Date object passed, should only be from {@link fireAll}
     * @param alarm The alarm to check and possibly fire
     */
    private checkAlarm(now: Date, alarm: Alarm): void {

        // bail out if this alarm is not active today
        if (!AlarmUtils.isActiveToday(alarm)) {
            return;
        }

        // fire any alarms that should be going off right this minute
        const nowTime: Time = Time.createFromDate(now);
        const timesMap = TimerService.alarmTimesAsMap(alarm);
        Array.from(timesMap.entries()).forEach((e: [AlarmEventType, Time]) => {
            // ignore seconds, in case this fires a second too early or late
            if (e[1].equals(nowTime, true)) {
                this.fireAll(TimerEvent.ALARM, now, new AlarmEvent(alarm, e[0], this.snoozeAlarmEvent.bind(this)));
            }
        });
    }

    /**
     * Fetches a list of active {@link Alarm}s, or an empty list if no {@link Schedule} is active.
     */
    private async fetchActiveAlarms(): Promise<Alarm[]> {
        const schedule: Schedule | undefined = await this.db.getService(ScheduleService).getEnabled();
        return schedule ? await this.db.getService(AlarmService).getBySchedule(schedule) : [];
    }

    /**
     * Snoozes an {@link AlarmEvent} for the time specified by the relevant {@link Schedule}'s configured snooze time.
     *
     * @param alarmEvent AlarmEvent to snooze
     */
    private async snoozeAlarmEvent(alarmEvent: AlarmEvent): Promise<void> {
        this.snoozedEvent = alarmEvent;

        // initialize the snooze time
        const schedule: Schedule = await this.db.getService(ScheduleService).get(alarmEvent.alarm.scheduleId);
        this.snoozeTime = schedule.snoozeTime;
    }
}
