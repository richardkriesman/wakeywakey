import * as React from "react";
import Renderer from "react-test-renderer";
import { createNavigationMock } from "../../../utils/TestUtils";
import MainSettingsScreen from "../MainSettingsScreen";

it("renders properly", () => {
    const tree = Renderer.create(<MainSettingsScreen navigation={createNavigationMock()}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});

describe("toggles", () => {
    it("handles toggling", () => {
        const screen = new MainSettingsScreen({ navigation: createNavigationMock() });

        screen.componentWillMount();
        screen.render();

        const setState = jest.spyOn(screen, "setState");
        screen.onScheduleItemToggled(screen.state.schedules.length - 1, true);
        expect(setState).toHaveBeenCalledTimes(1);
    });
});
