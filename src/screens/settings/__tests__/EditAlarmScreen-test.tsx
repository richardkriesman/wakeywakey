import * as React from "react";
import renderer from "react-test-renderer";
import { createNavigationMock } from "../../../utils/testUtils";
import EditAlarmScreen from "../EditAlarmScreen";

it("renders correctly", () => {
    // TODO need to mock navigation.getParam() to actually return a value
    // ...but still be a Jest spy?
    const tree = renderer.create(<EditAlarmScreen navigation={createNavigationMock()} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
