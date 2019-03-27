import * as React from "react";
import { Button } from "react-native-elements";
import renderer from "react-test-renderer";
import { HeaderAddButton } from "../HeaderAddButton";

it("renders correctly", () => {
    expect(
        renderer.create(<HeaderAddButton onPress={() => void 0}/>).toJSON()
    ).toMatchSnapshot();
});

it("responds to press", () => {
    const returnValue: string = "Button pressed";

    const onPress = jest.fn();
    onPress.mockReturnValue(returnValue);

    const tree = renderer.create(<HeaderAddButton onPress={onPress}/>);
    expect(tree.root.findByType(Button).props.onPress()).toBe(returnValue);
});
