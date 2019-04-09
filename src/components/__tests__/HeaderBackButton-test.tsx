import * as React from "react";
import renderer from "react-test-renderer";
import { HeaderBackButton } from "../HeaderBackButton";

const createTestProps = (props: object) => ({
    navigation: {},
    onPress: jest.fn(),
    ...props
});

describe("HeaderBackButton", () => {

    let props: any;

    beforeEach(() => {
        props = createTestProps({ title: "Test Button" });
    });

    it("renders correctly", () => {
        const tree = renderer.create(<HeaderBackButton {...props} />).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("calls the correct navigation function onPress", () => {
        const button = renderer.create(<HeaderBackButton {...props} />);
        button.root.findByType(HeaderBackButton).props.onPress();
        expect(props.onPress).toHaveBeenCalledTimes(1);
    });

});
