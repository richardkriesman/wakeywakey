import * as React from "react";
import renderer from "react-test-renderer";
import { PasscodeInput } from "../PasscodeInput";

describe("PasscodeInput", () => {

    let props: any;
    let component: any;

    beforeEach(() => {
        props = { handleSuccess: jest.fn() };
        component = renderer.create(<PasscodeInput {...props} />).getInstance();
        component.setState({ passcode: "1234" });
    });

    it("renders correctly", () => {
        const tree = renderer.create(<PasscodeInput {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("handles changeText with short passcode", () => {
        component.setState({ errorMessage: "..." });
        const setState = jest.spyOn(component, "setState");
        component.handleChangeText("123");
        expect(setState).toBeCalled();
    });

    it("handles changeText with correct length passcode", () => {
        const choosingPasscode = jest.spyOn(component, "handleChoosingPasscode");
        const confirmingPasscode = jest.spyOn(component, "handleConfirmingPasscode");
        component.handleChangeText("1234");
        expect(choosingPasscode).toBeCalled();
        component.setState({ isConfirming: true });
        component.handleChangeText("1234");
        expect(confirmingPasscode).toBeCalled();
    });

    it("handles submit editing", () => {
        const setState = jest.spyOn(component, "setState");
        component.handleSubmitEditing({ nativeEvent: { text: "1234" } });
        expect(setState).not.toBeCalled();
        component.handleSubmitEditing({ nativeEvent: { text: "123" } });
        expect(setState).toBeCalled();
    });

    it("choosing passcode with verify", async (done) => {
        props = {
            handleSuccess: jest.fn(),
            verifyPasscode: jest.fn().mockImplementation(async (passcode) => passcode === "1234")
        };
        component = renderer.create(<PasscodeInput {...props} />).getInstance();
        const setState = jest.spyOn(component, "setState");
        await component.handleChoosingPasscode("1234"); // correct passcode
        expect(props.handleSuccess).toBeCalled();
        await component.handleChoosingPasscode("5555"); // incorrect passcode
        expect(setState).toBeCalled();
        expect(props.verifyPasscode).toBeCalled();

        done();
    });

    it("choosing passcode without confirm", () => {
        component.handleChoosingPasscode("1234");
        expect(props.handleSuccess).toBeCalled();
    });

    it("choosing passcode with confirm", () => {
        props = { confirmPasscode: true, handleSuccess: jest.fn() };
        component = renderer.create(<PasscodeInput {...props} />).getInstance();
        const setState = jest.spyOn(component, "setState");
        component.handleChoosingPasscode("1234");
        expect(setState).toBeCalled();
    });

    it("confirming correct passcode", () => {
        component.handleConfirmingPasscode("1234");
        expect(props.handleSuccess).toBeCalled();
    });

    it("confirming incorrect passcode", () => {
        const setState = jest.spyOn(component, "setState");
        component.handleConfirmingPasscode("5555");
        expect(setState).toBeCalled();
    });
});
