import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import {HomeScreen} from "../HomeScreen";

describe("HomeScreen snapshot", () => {

    it("renders correctly", () => {
        const tree = renderer.create(<HomeScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
