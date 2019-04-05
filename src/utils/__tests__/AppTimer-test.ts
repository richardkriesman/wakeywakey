import MockDate from "mockdate";
import { AppTimer } from "../AppTimer";

let timer: AppTimer;

function walkForward(step: number, numSteps: number) {
    for (let i: number = 0; i < numSteps; i++) {
        // increase mocked time by one second and advance timers
        MockDate.set((i + 1) * step);
        jest.advanceTimersByTime(step);
    }
}

describe("TimerService", () => {

    jest.useFakeTimers();

    beforeEach(() => {
        MockDate.set(0);
        timer = new AppTimer(); // directly instantiate, rather than using instance
    });

    afterEach(() => {
        jest.clearAllTimers();
        timer.stop();
    });

    it("schedules a tick and fires events on start with on()", () => {
        const onStart = jest.fn();
        timer.on("start", onStart);

        timer.start();

        expect(onStart).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    it("fires an event every second for a minute", () => {
        const numSeconds: number = 60;

        const onSecond = jest.fn();
        timer.on("second", onSecond);

        timer.start();

        // no events should fire on Start except for START
        expect(onSecond).not.toHaveBeenCalled();

        const step: number = 1000;
        walkForward(step, numSeconds);

        expect(onSecond).toHaveBeenCalledTimes(numSeconds);
    });

    it("fires an event every minute for an hour", () => {
        const numMinutes: number = 60;

        const onMinute = jest.fn();
        timer.on("minute", onMinute);

        timer.start();
        expect(onMinute).not.toHaveBeenCalled();

        const step: number = 1000 * 60; // 60-second step
        walkForward(step, numMinutes);

        expect(onMinute).toHaveBeenCalledTimes(numMinutes);
    });

    it("fires an event every hour for a day", () => {
        const numHours = 24;

        const onHour = jest.fn();
        timer.on("hour", onHour);

        timer.start();
        expect(onHour).not.toHaveBeenCalled();

        const step: number = 1000 * 60 * 60; // 60-minute step
        walkForward(step, numHours);

        expect(onHour).toHaveBeenCalledTimes(numHours);
    });

    it("fires an event every second for a day", () => {
        const numSeconds = 60 * 60 * 24; // 60 minutes in an hour, 24 hours in a day

        const onSecond = jest.fn();
        timer.on("second", onSecond);

        timer.start();
        expect(onSecond).not.toHaveBeenCalled();

        const step: number = 1000;
        walkForward(step, numSeconds);

        expect(onSecond).toHaveBeenCalledTimes(numSeconds);
    });

    it("clears timeout on stop()", () => {
        const onStop = jest.fn();
        timer.on("stop", onStop);

        timer.start();
        expect(onStop).not.toHaveBeenCalled();

        timer.stop();

        expect(clearTimeout).toHaveBeenCalled();
        expect(onStop).toHaveBeenCalledTimes(1);

        expect(timer.timeoutId).toBeUndefined();
    });

});
