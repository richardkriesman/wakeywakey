import MockDate from "mockdate";
import * as React from "react";

import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import Renderer from "react-test-renderer";
import AppNavigator from "../AppNavigator";

const fakeDateMillis = 1551896555862;

describe("AppNavigator", () => {
    jest.useFakeTimers();

    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
        MockDate.set(fakeDateMillis);
    });

    it("renders properly", () => {
        const tree = Renderer.create(<AppNavigator/>);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
