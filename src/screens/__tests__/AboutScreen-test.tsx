import React from "react";
import "react-native";
import renderer, { ReactTestInstance } from "react-test-renderer";
import {TestEnvironment} from "../../utils/testing";
import { AboutScreen } from "../AboutScreen";

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
        <AboutScreen {...env.emptyUIScreenProps} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});
