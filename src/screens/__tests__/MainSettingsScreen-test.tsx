import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import {TestEnvironment} from "../../utils/testing";
import MainSettingsScreen from "../settings/MainSettingsScreen";

describe("App snapshot", () => {
    jest.useFakeTimers();

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
            <MainSettingsScreen navigation={env.navigationProp} />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
