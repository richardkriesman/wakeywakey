import React from "react";
import "react-native";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import renderer from "react-test-renderer";
import {createNavigationMock} from "../../utils/testUtils";
import MainSettingsScreen from "../settings/MainSettingsScreen";

describe("App snapshot", () => {
    jest.useFakeTimers();

    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it("renders the screen", async () => {
        const tree = renderer.create(
            <MainSettingsScreen navigation={createNavigationMock()} />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
