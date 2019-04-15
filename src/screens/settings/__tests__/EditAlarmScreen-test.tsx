import * as React from "react";
import renderer from "react-test-renderer";
import { TestEnvironment } from "../../../utils/testing";
import EditAlarmScreen from "../EditAlarmScreen";

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            done();
        });
});

it("renders correctly", () => {
    // TODO need to mock navigation.getParam() to actually return a value
    // ...but still be a Jest spy?
    const tree = renderer.create(<EditAlarmScreen navigation={env.navigationProp} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
