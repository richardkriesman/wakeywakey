import React from "react";
import "react-native";
import renderer from "react-test-renderer";

import { App } from "../App";
import { TestEnvironment } from "../utils/testing";

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

it("correctly fakes Date.now", async () => {
    const fakeNow = Date.now();
    expect(fakeNow).toBe(fakeDateMillis);
});

it("renders the loading screen", async () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
});

it("renders the root without loading screen", async () => {
    const tree = renderer.create(<App db={env.db} skipLoadingScreen={true} />).toJSON();
    expect(tree).toMatchSnapshot();
});
