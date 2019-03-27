import * as React from "react";
import { Button } from "react-native-elements";
import renderer from "react-test-renderer";
import { SlideUpIndicator } from "../SlideUpIndicator";

describe("SlideUpIndicator", () => {

    it("renders properly", () => {
        const tree = renderer.create(<SlideUpIndicator onPress={() => void 0}/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("reacts to onPress", () => {
        const resultText: string = "'Slide Up' indicator pressed";

        const onPress = jest.fn();
        onPress.mockReturnValue(resultText);

        const tree = renderer.create(<SlideUpIndicator onPress={onPress}/>);
        expect(tree.root.findByType(Button).props.onPress()).toBe(resultText);
    });

});
