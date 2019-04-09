import React from "react";
import "react-native";
import { TouchableWithoutFeedback } from "react-native";
import renderer from "react-test-renderer";
import { ToggleButton, ToggleButtonProps } from "../ToggleButton";

const createTestProps = (isToggled: boolean) => ({ isToggled, title: "OwO" });
const propsOn: ToggleButtonProps = createTestProps(true);
const propsOff: ToggleButtonProps = createTestProps(false);

describe("rendering", () => {

    it("should render the title", () => {
        const tree = renderer.create(<ToggleButton {...propsOff} />);
        expect(tree.root.props.title).toBe(propsOn.title);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    describe("should match snapshots", () => {
        it("matches, initially on", () => {
            const tree = renderer.create(<ToggleButton {...propsOn}/>);
            expect(tree.toJSON()).toMatchSnapshot();
        });

        it("matches, initially off", () => {
            const tree = renderer.create(<ToggleButton {...propsOff}/>);
            expect(tree.toJSON()).toMatchSnapshot();
        });
    });

    describe("should have fields set correctly", () => {
        it("sets isToggled properly", () => {
            const buttonOn = new ToggleButton(propsOn);
            expect(buttonOn.isToggled).toBe(true);

            const buttonOff = new ToggleButton(propsOff);
            expect(buttonOff.isToggled).toBe(false);
        });
    });
});

describe("actions", () => {

    // mock Animated to avoid messing around with fake timers
    jest.mock("Animated", () => {
        const ActualAnimated = jest.requireActual("Animated");
        return {
            ...ActualAnimated,
            timing: (value: any, config: any) => {
                return {
                    start: (cb: any) => {
                        value.setValue(config.toValue);
                        if (cb) {
                            cb();
                        }
                    }
                };
            }
        };
    });

    it("should toggle on", () => {
        const tree = renderer.create(<ToggleButton {...propsOff}/>);
        tree.root.findByType(TouchableWithoutFeedback).props.onPress();
        expect(tree).toMatchSnapshot();
    });

    it("should toggle off", () => {
        const tree = renderer.create(<ToggleButton {...propsOn}/>);
        tree.root.findByType(TouchableWithoutFeedback).props.onPress();
        expect(tree).toMatchSnapshot();
    });

});
