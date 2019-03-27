import * as React from "react";
import renderer from "react-test-renderer";
import { createNavigationMock } from "../../../utils/testUtils";
import EditScheduleScreen from "../EditScheduleScreen";

it("renders correctly", () => {
    // TODO need to mock navigation.getParam() to actually return a value
    // ...but still be a Jest spy?
    const tree = renderer.create(<EditScheduleScreen navigation={createNavigationMock()} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
