import * as React from "react";
import Renderer from "react-test-renderer";
import { TestEnvironment } from "../../../utils/testing";
import ScheduleListScreen from "../ScheduleListScreen";

let env: TestEnvironment;
beforeEach(async (done) => {
    env = await TestEnvironment.init();
    done();
});

it("renders properly", () => {
    const tree = Renderer.create(<ScheduleListScreen {...env.emptyUIScreenProps}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});
