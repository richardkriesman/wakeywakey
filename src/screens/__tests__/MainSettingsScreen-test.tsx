import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import {TestEnvironment} from "../../utils/testing";
import SchedulesListScreen from "../settings/SchedulesListScreen";

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            done();
        });
});

it("renders the screen", async () => {
    const tree = renderer.create(
        <SchedulesListScreen navigation={env.navigationProp} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
