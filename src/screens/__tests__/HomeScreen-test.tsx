import React from "react";
import "react-native";
import renderer, { ReactTestInstance } from "react-test-renderer";
import { TestEnvironment } from "../../utils/testing";
import HomeScreen from "../HomeScreen";

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

describe("screen instance methods", () => {

    it("switches to settings", () => {
        // mock component
        const component = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} {...env.emptyUIScreenProps}/>
        );

        // get instance
        const instance: (ReactTestInstance & HomeScreen) | null = component.getInstance() as any;
        expect(instance).toBeDefined();

        // spy on present
        const present = jest.spyOn(instance, "present");

        // switch to settings
        instance.switchToSettings();

        // check that everything was called correctly
        expect(present).toBeCalled();
    });

    it("snoozes the alarm", () => {
        // mock component
        const component = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} {...env.emptyUIScreenProps}/>
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
