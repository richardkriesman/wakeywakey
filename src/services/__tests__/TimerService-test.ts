import MockDate from "mockdate";
import { TimerService } from "../TimerService";

let timer: TimerService;

describe("TimerService", () => {

    jest.useFakeTimers();

    beforeEach(() => {
        MockDate.set(0);
        timer = new TimerService(null);
    });

    afterEach(() => {
        jest.clearAllTimers();
        timer.stop();
    });

    it("schedules a tick and fires events on start", () => {
        const onStart = jest.fn();
        const addHandler = jest.spyOn(timer, "addHandler");

        timer.on("start", onStart);

        timer.start();

        expect(onStart).toHaveBeenCalledTimes(1);
        expect(addHandler).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenCalledTimes(1);
    });

    it("fires an event every second for a minute", () => {
        const numSeconds: number = 60;

        const onSecond = jest.fn();
        timer.on("second", onSecond);

        timer.start();
        expect(onSecond).not.toHaveBeenCalled();

        for (let i: number = 0; i < numSeconds; i++) {
            // increase mocked time by one second and advance timers
            MockDate.set((i + 1) * 1000);
            jest.advanceTimersByTime(1000);
        }

        expect(onSecond).toHaveBeenCalledTimes(numSeconds);
    });

});
