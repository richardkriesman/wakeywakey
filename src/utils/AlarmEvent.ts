import { Alarm } from "../models/Alarm";

/**
 * The type of {@link AlarmEventType} being fired
 */
export enum AlarmEventType {
    Sleep,
    Wake,
    GetUp
}

export class AlarmEvent {

    public readonly alarm: Alarm;
    public readonly type: AlarmEventType;

    private readonly snoozeFn: (event: AlarmEvent) => Promise<void>;

    public constructor(alarm: Alarm, type: AlarmEventType, snoozeFn: (event: AlarmEvent) => Promise<void>) {
        this.alarm = alarm;
        this.snoozeFn = snoozeFn;
        this.type = type;
    }

    /**
     * Schedules the {@link AlarmEvent} to be replayed after its specified snooze time.
     */
    public snooze(): Promise<void> {
        return this.snoozeFn(this);
    }

}
