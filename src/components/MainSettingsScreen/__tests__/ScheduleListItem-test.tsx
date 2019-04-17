import React from "react";
import "react-native";
import renderer, { ReactTestInstance, ReactTestRenderer } from "react-test-renderer";
import { ScheduleListItem } from "../ScheduleListItem";

const testProps = (enabled: boolean = true) => ({
    enabled,
    onPress: jest.fn(),
    onSwitchToggled: jest.fn(),
    title: "Schedule 420"
});

it("renders title correctly", () => {
    const tree = renderer.create(<ScheduleListItem {...testProps()} />).toJSON();
    expect(tree).toMatchSnapshot();
});

describe("sets the toggle switch with props correctly", () => {

    it("disabled", () => {
        // test with switch disabled
        const disabledTree = renderer.create(<ScheduleListItem {...testProps(false)} />).toJSON();
        expect(disabledTree).toMatchSnapshot();
    });

    it("enabled", () => {
        // test with switch enabled
        const enabledTree = renderer.create(<ScheduleListItem {...testProps()} />).toJSON();
        expect(enabledTree).toMatchSnapshot();
    });

});

it("sets the toggle switch with state change correctly", async (done) => {
    // component; initially false
    const props = testProps(false);
    const component: ReactTestRenderer = renderer.create(<ScheduleListItem {...props} />);

    // get instance
    const instance: (ReactTestInstance & ScheduleListItem) | null = component.getInstance() as any;
    expect(instance).toBeDefined();

    // invoke forceEnabled and expect state to change
    await instance.forceEnabled(true);
    expect(instance.state.enabled).toBe(true); // ideally this should be through a getter

    done();
});

// TODO need to mock simulated switch toggle and test for update methods to be called

it("invokes the proper methods when onSwitchValueChanged is called", () => {
    // component; initially false
    const props = testProps(false);
    const component: ReactTestRenderer = renderer.create(<ScheduleListItem {...props} />);

    // get instance
    const instance: (ReactTestInstance & ScheduleListItem) | null = component.getInstance() as any;
    expect(instance).toBeDefined();

    // spy on methods
    const forceEnabled = jest.spyOn(instance, "forceEnabled");

    // invoke method
    instance.onSwitchValueChanged(true);

    // expect spied methods to be called
    expect(forceEnabled).toBeCalledWith(true);
});
