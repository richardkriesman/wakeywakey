import * as React from "react";
import { AppState } from "react-native";
import renderer from "react-test-renderer";
import { InactivityHandler } from "../InactivityHandler";

jest.useFakeTimers();

const createTestProps = (props: object) => ({
    navigation: {
        addListener: jest.fn(),
        popToTop: jest.fn()
    },
    ...props
});

describe("InactivityHandler", () => {

    let props: any;

    beforeEach(() => {
        props = createTestProps({ idleTime: 15000 });
    });

    it("renders correctly", () => {
        const tree = renderer.create(<InactivityHandler {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("correctly handles pan response", () => {
        const component = renderer.create(<InactivityHandler {...props} />).getInstance();
        component.setState({ active: false });

        const onActiveChange = jest.spyOn(component, "onActiveChange");
        const setIdleTimer = jest.spyOn(component, "setIdleTimer");

        expect(component.handlePanResponderCapture()).toBe(false);

        expect(onActiveChange).toBeCalled();
        expect(setIdleTimer).toBeCalled();
    });

    it("change function called after inactivity", () => {
        const component = renderer.create(<InactivityHandler {...props} />).getInstance();
        const onActiveChange = jest.spyOn(component, "onActiveChange");

        component.setIdleTimer();
        expect(onActiveChange).not.toBeCalled();
        jest.advanceTimersByTime(15000);
        expect(onActiveChange).toBeCalled();
    });

    it("correctly handles on focus", () => {
        const component = renderer.create(<InactivityHandler {...props} />).getInstance();
        const setIdleTimer = jest.spyOn(component, "setIdleTimer");
        component.componentDidFocus();
        expect(setIdleTimer).toBeCalled();
    });

    it("correctly handles on blur", () => {
        const component = renderer.create(<InactivityHandler {...props} />).getInstance();
        const onActiveChange = jest.spyOn(component, "onActiveChange");
        component.componentDidBlur();
        expect(onActiveChange).toBeCalled();
    });

    it("correctly pops to top if restarts app", () => {
        const component = renderer.create(<InactivityHandler {...props} />).getInstance();
        component.setState({ currentState: "background" });

        component.handleAppStateChange("active");
        expect(component.props.navigation.popToTop).toBeCalled();
    });

    it("removes listener on unmount", () => {
        AppState.removeEventListener = jest.fn();
        const component = renderer.create(<InactivityHandler {...props} />).getInstance();
        component.componentWillUnmount();
        expect(AppState.removeEventListener).toBeCalled();
    });
});
