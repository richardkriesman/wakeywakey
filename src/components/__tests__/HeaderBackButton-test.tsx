import * as React from "react";
import { Button } from "react-native-elements";
import { StackActions } from "react-navigation";
import renderer from "react-test-renderer";
import { HeaderBackButton } from "../HeaderBackButton";

const createTestProps = (props: object) => ({
    navigation: {
        dispatch: jest.fn()
    },
    ...props
});

describe("HeaderBackButton", () => {

    let props: any;

    beforeEach(() => {
        props = createTestProps({ title: "Back" });
    });

    it("renders correctly", () => {
        const tree = renderer.create(<HeaderBackButton {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls the correct navigation function onPress", () => {
        const elem = renderer.create(<HeaderBackButton {...props} />);
        elem.root.findByType(Button).props.onPress();

        expect(props.navigation.dispatch).toHaveBeenCalledWith(
            StackActions.pop({ n: 1 })
        );
    });

});
