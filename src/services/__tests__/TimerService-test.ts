import { TestEnvironment } from "../../utils/testing";
import { TimerService } from "../TimerService";

describe("TimerService", () => {

    let env: TestEnvironment;
    let timer: TimerService;

    beforeEach(async (done) => {
        env = await TestEnvironment.init();
        env.timing.date = 0;
        timer = env.db.getService(TimerService);
        done();
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
        const numSeconds = (numMinutes * 60) + 1;

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

        for (let i: number = 0; i < numSeconds; i++) {
            env.timing.forward(1000);
        }

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
