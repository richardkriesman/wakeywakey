import * as React from "react";
import renderer from "react-test-renderer";
import { ScheduleListHeader } from "../ScheduleListHeader";

it("renders correctly", () => {
    expect(renderer.create(<ScheduleListHeader title="OwO" />).toJSON()).toMatchSnapshot();
});
