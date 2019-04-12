import * as React from "react";
import renderer from "react-test-renderer";
import { InactivityDimmer } from "../InactivityDimmer";

jest.useFakeTimers();

const createTestProps = (props: object) => ({
    navigation: { addListener: jest.fn() },
    ...props
});

describe("InactivityDimmer", () => {

    let props: any;

    beforeEach(() => {
        props = createTestProps({ idleTime: 15000 });
    });

    it("renders correctly", () => {
        const tree = renderer.create(<InactivityDimmer {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("change function called after inactivity", () => {
        const component = renderer.create(<InactivityDimmer {...props} />).getInstance();
        const onActiveChange = jest.spyOn(component, "onActiveChange");

        component.setIdleTimer();
        expect(onActiveChange).not.toBeCalled();
        jest.advanceTimersByTime(15000);
        expect(onActiveChange).toBeCalled();
    });
});
