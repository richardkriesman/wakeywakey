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
    const tree = Renderer.create(<SchedulesListScreen {...env.emptyUIScreenProps}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});
