import { Alarm } from "../../models/Alarm";
import { AlarmEvent, AlarmEventType } from "../../services/TimerService";

export enum AlarmStateType { NONE, SLEEP, WAKE, GET_UP }

interface IAlarmState {
    type: AlarmStateType;
    alarm?: Alarm;
}

export class AlarmState implements IAlarmState {
    public static fromAlarmEvent(event: AlarmEvent): AlarmState {
        let type: AlarmStateType;

        switch (event.type) {
            case AlarmEventType.SLEEP:
                type = AlarmStateType.SLEEP;
                break;
            case AlarmEventType.WAKE:
                type = AlarmStateType.WAKE;
                break;
            case AlarmEventType.GET_UP:
                type = AlarmStateType.GET_UP;
                break;
            default:
                type = AlarmStateType.NONE;
                break;
        }

        return new AlarmState(type, event.alarm);
    }

    public static getMessageText(event: AlarmState): string {
        return messageTextMap.get(event.type);
    }

    public type: AlarmStateType;
    public alarm?: Alarm;

    public constructor(type: AlarmStateType, alarm?: Alarm) {
        this.type = type;
        this.alarm = alarm;
    }

    public toString(): string {
        return `{ type: ${this.type}, alarm_id: ${this.alarm.id} }`;
    }
}

const messageTextMap: Map<AlarmStateType, string> = new Map<AlarmStateType, string>([
    [AlarmStateType.NONE, "Hello, world!"],
    [AlarmStateType.SLEEP, "Time for bed!"],
    [AlarmStateType.WAKE, "Time to wake up!"],
    [AlarmStateType.GET_UP, "Time to get up!"]
]);
