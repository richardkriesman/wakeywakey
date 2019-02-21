import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import {App} from "../App";
import {NavigationTestUtils} from "../utils/TestUtils";

describe("App snapshot", () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it("renders the loading screen", async () => {
        const tree = renderer.create(<App skipLoadingScreen={false}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders the root without loading screen", async () => {
        const tree = renderer.create(<App skipLoadingScreen={true}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
