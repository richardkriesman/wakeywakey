import * as React from "react";
import renderer from "react-test-renderer";
import { createNavigationMock } from "../../../utils/testUtils";
import MainSettingsScreen from "../MainSettingsScreen";

it("renders properly", () => {
    expect(
        renderer.create(<MainSettingsScreen navigation={createNavigationMock()} />).toJSON()
    ).toMatchSnapshot();
});
