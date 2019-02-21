import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import LinksScreen from "../LinksScreen";

describe("LinksScreen snapshot", () => {

    it("renders correctly", () => {
        const tree = renderer.create(<LinksScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
