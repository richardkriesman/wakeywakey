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

    it("fires events at the proper times for a week", () => {
        const numDays = 7;
        const numHours = numDays * 24;
        const numMinutes = numHours * 60;
        const numSeconds = numMinutes * 60;

        const onHour = jest.fn();
        const onMinute = jest.fn();
        const onSecond = jest.fn();

        timer.on("hour", onHour);
        timer.on("minute", onMinute);
        timer.on("second", onSecond);

        timer.start();
        expect(onHour).not.toHaveBeenCalled();
        expect(onMinute).not.toHaveBeenCalled();
        expect(onSecond).not.toHaveBeenCalled();

        const step: number = 1000;
        walkForward(step, numSeconds);

        expect(onHour).toHaveBeenCalledTimes(numHours);
        expect(onMinute).toHaveBeenCalledTimes(numMinutes);
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
