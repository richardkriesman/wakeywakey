import React from "react";
import "react-native";
import renderer, {ReactTestInstance, ReactTestRenderer} from "react-test-renderer";
import {ScheduleListItem} from "../ScheduleListItem";

it("renders title correctly", () => {
    const tree = renderer.create(
        <ScheduleListItem
            enabled={true}
            title="Schedule 420"
            onPress={jest.fn()}
            onSwitchToggled={jest.fn()} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});

it("sets the toggle switch with props correctly", () => {

    // test with switch disabled
    const disabledTree = renderer.create(
        <ScheduleListItem
            enabled={false}
            title="Schedule 420"
            onPress={jest.fn()}
            onSwitchToggled={jest.fn()} />
    ).toJSON();
    expect(disabledTree).toMatchSnapshot();

    // test with switch enabled
    const enabledTree = renderer.create(
        <ScheduleListItem
            enabled={true}
            title="Schedule 420"
            onPress={jest.fn()}
            onSwitchToggled={jest.fn()} />
    ).toJSON();
    expect(enabledTree).toMatchSnapshot();

});

it("sets the toggle switch with state change correctly", () => {
    const component: ReactTestRenderer = renderer.create(
        <ScheduleListItem
            enabled={false}
            title="Schedule 420"
            onPress={jest.fn()}
            onSwitchToggled={jest.fn()}
        />
    );

    // get instance
    const instance: (ReactTestInstance&ScheduleListItem)|null = component.getInstance() as any;
    expect(instance).toBeDefined();

    // check if switch can be force-enabled
    instance.forceEnabled(true);
    expect(instance.state.enabled).toBe(true); // ideally this should be through a getter
});
