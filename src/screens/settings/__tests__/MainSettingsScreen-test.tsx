import * as React from "react";
import Renderer from "react-test-renderer";
import { TestEnvironment } from "../../../utils/testing";
import MainSettingsScreen from "../MainSettingsScreen";

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            done();
        });
});

it("renders properly", () => {
    const tree = Renderer.create(<MainSettingsScreen navigation={env.navigationProp}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});

describe("toggles", () => {
    it("handles toggling", () => {
        const screen = new MainSettingsScreen({ navigation: env.navigationProp });

        screen.componentWillMount();
        screen.render();

        const setState = jest.spyOn(screen, "setState");
        screen.onScheduleItemToggled(screen.state.schedules.length - 1, true);
        expect(setState).toHaveBeenCalledTimes(1);
    });
});
