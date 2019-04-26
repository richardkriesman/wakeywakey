import * as React from "react";
import renderer from "react-test-renderer";
import { Alarm, Schedule } from "../../../models";
import { AlarmDay } from "../../../models/Alarm";
import { AlarmService, ScheduleService } from "../../../services";
import { TestEnvironment } from "../../../utils/testing";
import { Time } from "../../../utils/Time";
import EditAlarmScreen from "../EditAlarmScreen";

jest.mock("../../../services/AlarmService");
jest.mock("../../../services/ScheduleService");

let alarm: Alarm;
let env: TestEnvironment;
let schedule: Schedule;
beforeEach((done) => {
    TestEnvironment.init() // create new test env
        .then((newEnv) => {
            env = newEnv;
            env.timing.date = 0;
            return env.db.getService(ScheduleService).create("Test schedule"); // create new test schedule
        })
        .then((newSchedule) => {
            schedule = newSchedule;
            return env.db.getService(AlarmService).create(schedule, // create new test alarm
                Time.createFromTotalSeconds(72000),
                Time.createFromTotalSeconds(21600),
                Time.createFromTotalSeconds(25200),
                AlarmDay.Monday | AlarmDay.Wednesday | AlarmDay.Friday);
        })
        .then((newAlarm) => {
            alarm = newAlarm;
            done();
        });
});

it("renders correctly", () => {

    // create props
    const props = env.emptyUIScreenProps;
    props.navigation.setParams({
        activeDays: 0,
        alarm,
        is24HourTime: false,
        schedule
    });

    // render tree
    const tree = renderer.create(<EditAlarmScreen {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();

});
