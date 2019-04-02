import MockDate from "mockdate";
import { AppTimer } from "../AppTimer";

let timer: AppTimer;

describe("TimerService", () => {

    jest.useFakeTimers();

    beforeEach(() => {
        MockDate.set(0);
        timer = AppTimer.Instance;
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

        for (let i: number = 0; i < numSeconds; i++) {
            // increase mocked time by one second and advance timers
            MockDate.set((i + 1) * step);
            jest.advanceTimersByTime(step);
        }

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
