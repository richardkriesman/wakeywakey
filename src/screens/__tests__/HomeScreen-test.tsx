import React from "react";
import "react-native";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import renderer from "react-test-renderer";
import HomeScreen from "../HomeScreen";
import MockDate from "mockdate";
import {createNavigationMock} from "../../utils/testUtils";

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
            <HomeScreen initialMessageText={initialMessageText} navigation={createNavigationMock()} />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
