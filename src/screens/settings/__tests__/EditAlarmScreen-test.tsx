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
beforeEach(async (done) => {
    env = await TestEnvironment.init();
    env.timing.date = 0;

    // create a new alarm
    schedule = await env.db.getService(ScheduleService).create("Test schedule");
    alarm = await env.db.getService(AlarmService).create(schedule,
        Time.createFromTotalSeconds(72000),
        Time.createFromTotalSeconds(21600),
        Time.createFromTotalSeconds(25200),
        AlarmDay.Monday | AlarmDay.Wednesday | AlarmDay.Friday);

    done();
});

it("renders correctly", () => {

    // create props
    const props = env.emptyUIScreenProps;
    props.navigation.setParams({
        alarm,
        schedule
    });

    // render tree
    const tree = renderer.create(<EditAlarmScreen {...props} />);
    expect(tree.toJSON()).toMatchSnapshot();

});
