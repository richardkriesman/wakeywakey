import React from "react";
import "react-native";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import renderer, { ReactTestInstance } from "react-test-renderer";
import {createNavigationMock} from "../../../utils/TestUtils";
import PasscodeChangeScreen from "../PasscodeChangeScreen";

const PASSCODE_LENGTH = 4;
let component: any;

beforeEach(() => {
    component = renderer.create(
        <PasscodeChangeScreen navigation={createNavigationMock()} />)
        .getInstance();
});

it("renders correctly", () => {
    const tree = renderer.create(
        <PasscodeChangeScreen navigation={createNavigationMock()} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

it("should change error on submit", () => {
    component.handleSubmitEditing();
    expect(component.state.errorText).not.toEqual(" ");
});

describe("handle change text", () => {
    it("does nothing with short passcode", () => {
        const initialState = component.state;
        const testCodes = ["", "5", "13", "655"];

        testCodes.forEach((code) => {
            component.handleChangeText(code);
            expect(component.state).toEqual(initialState);
        });
    });

    it("correctly switches to confirming passcode", () => {
        const testCode = "1234";
        component.handleChangeText(testCode);
        expect(component.state.passcode).toBe(testCode);
        expect(component.state.isConfirming).toBe(true);
    });

    it("resets when confirm fails", () => {
        const testCode = "1234";
        component.setState({
            isConfirming: true,
            passcode: "4321"
        });

        component.handleChangeText(testCode);
        expect(component.state.passcode).toBe("");
        expect(component.state.isConfirming).toBe(false);
    });

    it("correctly calls dispatch when confirmed", () => {
        const navigationMock = createNavigationMock();
        navigationMock.dispatch = jest.fn();
        component = renderer.create(
            <PasscodeChangeScreen navigation={navigationMock} />)
            .getInstance();

        const testCode = "1234";
        component.setState({
            isConfirming: true,
            passcode: "1234"
        });

        component.handleChangeText(testCode);
        expect(navigationMock.dispatch).toBeCalled();
        expect(navigationMock.dispatch).lastCalledWith({
            routeName: "SettingsMain",
            type: "Navigation/REPLACE"
        });
    });
});
