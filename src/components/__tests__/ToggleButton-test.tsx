import React from "react";
import "react-native";
import { TouchableWithoutFeedback } from "react-native";
import renderer from "react-test-renderer";
import { ToggleButton } from "../ToggleButton";

const buttonTitle: string = "OwO";

describe("rendering", () => {
    it("should render the title", () => {
        const tree = renderer.create(<ToggleButton title={buttonTitle}/>);
        expect(tree.root.props.title).toBe(buttonTitle);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    it("initially off", () => {
        const tree = renderer.create(<ToggleButton title={buttonTitle}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("initially on", () => {
        const tree = renderer.create(<ToggleButton title={buttonTitle} isToggled/>).toJSON();
        expect(tree).toMatchSnapshot();
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
        const tree = renderer.create(<ToggleButton title={buttonTitle}/>);
        tree.root.findByType(TouchableWithoutFeedback).props.onPress();
        expect(tree).toMatchSnapshot();
    });

    it("should toggle off", () => {
        const tree = renderer.create(<ToggleButton title={buttonTitle} isToggled/>);
        tree.root.findByType(TouchableWithoutFeedback).props.onPress();
        expect(tree).toMatchSnapshot();
    });

});
