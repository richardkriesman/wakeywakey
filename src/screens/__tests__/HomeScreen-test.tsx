import MockDate from "mockdate";
import React from "react";
import "react-native";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import renderer, { ReactTestInstance } from "react-test-renderer";
import { createNavigationMock } from "../../utils/testUtils";
import HomeScreen from "../HomeScreen";

const fakeDateMillis = 1551896555862;
const initialMessageText: string = "Lorem ipsum dolar sit amet";

describe("App snapshot", () => {
    jest.useFakeTimers();

    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
        MockDate.set(fakeDateMillis);
    });

    it("correctly fakes Date.now", async () => {
        const fakeNow = Date.now();
        expect(fakeNow).toBe(fakeDateMillis);
    });

    it("renders the screen", async () => {
        const tree = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} navigation={createNavigationMock()}/>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

});

describe("screen instance methods", () => {

    it("switches to settings", () => {
        // mock navigation and component
        const navigation = createNavigationMock();
        const component = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} navigation={navigation}/>
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
        // mock navigation and component
        const navigation = createNavigationMock();
        const component = renderer.create(
            <HomeScreen initialMessageText={initialMessageText} navigation={navigation}/>
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
