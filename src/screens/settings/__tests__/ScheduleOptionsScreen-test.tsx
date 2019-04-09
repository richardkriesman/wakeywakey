import * as React from "react";
import renderer from "react-test-renderer";
import { createNavigationMock } from "../../../utils/TestUtils";
import { ScheduleOptionsScreen } from "../ScheduleOptionsScreen";

it("renders correctly", () => {
    const tree = renderer.create(<ScheduleOptionsScreen navigation={createNavigationMock()}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});
