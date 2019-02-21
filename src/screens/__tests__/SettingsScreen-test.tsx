import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import SettingsScreen from "../SettingsScreen";

describe("SettingsScreen snapshot", () => {

    it("renders correctly", () => {
        const tree = renderer.create(<SettingsScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
