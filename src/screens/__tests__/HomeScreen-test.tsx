import React from "react";
import "react-native";
import renderer, { ReactTestInstance } from "react-test-renderer";
import { TestEnvironment } from "../../utils/TestUtils";
import HomeScreen from "../HomeScreen";

const fakeDateMillis = 1551896555862;
const initialMessageText: string = "Lorem ipsum dolar sit amet";

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            env.date = fakeDateMillis;
            done();
        });
});

describe("App snapshot", () => {
    jest.useFakeTimers();

    it("correctly fakes Date.now", async () => {
        const fakeNow = Date.now();
        expect(fakeNow).toBe(fakeDateMillis);
    });

    it("renders the screen", async () => {
        const tree = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} navigation={env.navigationProp} />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

});

describe("screen instance methods", () => {

    it("switches to settings", () => {
        // mock component
        const component = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} navigation={env.navigationProp}/>
        );

        // get instance
        const instance: (ReactTestInstance & HomeScreen) | null = component.getInstance() as any;
        expect(instance).toBeDefined();

        // spy on setState
        const setState = jest.spyOn(instance, "setState");

        // switch to settings
        instance.switchToSettings();

        // check that everything was called correctly
        expect(setState).toBeCalled();
    });

    it("snoozes the alarm", () => {
        // mock component
        const component = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} navigation={env.navigationProp}/>
        );

        // get instance
        const instance: (ReactTestInstance & HomeScreen) | null = component.getInstance() as any;
        expect(instance).toBeDefined();

        // spy on setState
        const setState = jest.spyOn(instance, "setState");

        // switch to settings
        instance.onSnoozePressed();

        // check that everything was called correctly
        expect(setState).toBeCalled();
    });

});
