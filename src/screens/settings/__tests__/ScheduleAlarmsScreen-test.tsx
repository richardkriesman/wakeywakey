import * as React from "react";
import renderer from "react-test-renderer";
import { createNavigationMock } from "../../../utils/TestUtils";
import ScheduleAlarmsScreen from "../ScheduleAlarmsScreen";

it("renders correctly", () => {
    const tree = renderer.create(<ScheduleAlarmsScreen navigation={createNavigationMock()}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});
