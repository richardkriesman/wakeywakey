import * as React from "react";
import renderer from "react-test-renderer";
import { TestEnvironment } from "../../../utils/testing";
import ScheduleAlarmsScreen from "../ScheduleAlarmsScreen";

jest.mock("../../../models/Schedule");
jest.mock("../../../models/Alarm");

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            done();
        });
});

it("renders correctly", () => {
    const tree = renderer.create(<ScheduleAlarmsScreen navigation={env.navigationProp}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});
