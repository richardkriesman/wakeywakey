import * as React from "react";
import Renderer from "react-test-renderer";
import { TestEnvironment } from "../../../utils/testing";
import SchedulesListScreen from "../SchedulesListScreen";

let env: TestEnvironment;
beforeEach(async (done) => {
    env = await TestEnvironment.init();
    done();
});

it("renders properly", () => {
    const tree = Renderer.create(<SchedulesListScreen navigation={env.navigationProp}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});

describe("toggles", () => {
    it("handles toggling", () => {
        const screen = new SchedulesListScreen({ navigation: env.navigationProp });

        screen.componentWillMount();
        screen.render();

        // const setState = jest.spyOn(screen, "setState");
        // screen.onScheduleItemToggled(screen.state.schedules.length - 1, true);
        // expect(setState).toHaveBeenCalledTimes(1);
    });
});
