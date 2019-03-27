import * as React from "react";
import { Button } from "react-native-elements";
import renderer from "react-test-renderer";
import { SlideUpIndicator } from "../SlideUpIndicator";
import { SnoozeButton } from "../SnoozeButton";

describe("SnoozeButton", () => {

    it("renders correctly", () => {
        const tree = renderer.create(<SnoozeButton onPress={() => void 0}/>);
        expect(tree).toMatchSnapshot();
    });

    it("reacts to onPress", () => {
        const resultText: string = "Alarm snoozed";

        const onPress = jest.fn();
        onPress.mockReturnValue(resultText);

        const tree = renderer.create(<SlideUpIndicator onPress={onPress}/>);
        expect(tree.root.findByType(Button).props.onPress()).toBe(resultText);
    });

});
