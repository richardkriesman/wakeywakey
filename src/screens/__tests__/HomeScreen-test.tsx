import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import { TestEnvironment } from "../../utils/testing";
import { HomeScreen } from "../HomeScreen";

const fakeDateMillis = 1551896555862;
const initialMessageText: string = "Lorem ipsum dolar sit amet";

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            env.timing.date = fakeDateMillis;
            done();
        });
});

describe("app snapshot", () => {

    it("correctly fakes Date.now", async () => {
        const fakeNow = Date.now();
        expect(fakeNow).toBe(fakeDateMillis);
    });

    it("renders the screen", async () => {
        const tree = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} {...env.emptyUIScreenProps} />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
