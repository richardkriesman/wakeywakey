import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import {TestEnvironment} from "../../utils/testing";
import ScheduleListScreen from "../settings/ScheduleListScreen";

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
        <ScheduleListScreen {...env.emptyUIScreenProps} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
