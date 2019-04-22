import * as React from "react";

import Renderer from "react-test-renderer";
import { TestEnvironment } from "../../utils/testing";
import AppNavigator from "../AppNavigator";

const fakeDateMillis = 1551896555862;

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            env.timing.date = fakeDateMillis;
            done();
        });
});

it("renders properly", () => {
    const tree = Renderer.create(<AppNavigator/>);
    expect(tree.toJSON()).toMatchSnapshot();
});
