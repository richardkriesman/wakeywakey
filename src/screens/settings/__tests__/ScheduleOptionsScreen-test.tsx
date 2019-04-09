import * as React from "react";
import renderer from "react-test-renderer";
import { TestEnvironment } from "../../../utils/TestUtils";
import { ScheduleOptionsScreen } from "../ScheduleOptionsScreen";

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            done();
        });
});

it("renders correctly", () => {
    const tree = renderer.create(<ScheduleOptionsScreen navigation={env.navigationProp}/>);
    expect(tree.toJSON()).toMatchSnapshot();
});
