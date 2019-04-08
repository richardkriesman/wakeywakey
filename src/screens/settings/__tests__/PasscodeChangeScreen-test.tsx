import React from "react";
import "react-native";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import renderer, { ReactTestInstance } from "react-test-renderer";
import {createNavigationMock} from "../../../utils/TestUtils";
import PasscodeChangeScreen from "../PasscodeChangeScreen";

it("renders correctly", () => {
    const tree = renderer.create(
        <PasscodeChangeScreen navigation={createNavigationMock()} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

it("correctly routes after success", () => {
    const navigationMock = createNavigationMock();
    navigationMock.dispatch = jest.fn();
    const component: any = renderer.create(
        <PasscodeChangeScreen navigation={navigationMock} />)
        .getInstance();

    component.handleSuccess("1234");
    expect(navigationMock.dispatch).toBeCalled();
    expect(navigationMock.dispatch).lastCalledWith({
        routeName: "SettingsMain",
        type: "Navigation/REPLACE"
    });
});
