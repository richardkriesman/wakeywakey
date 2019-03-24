import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import {ToggleButton} from "../ToggleButton";

it("renders title correctly", () => {
    const tree = renderer.create(<ToggleButton title="OwO"/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it("sets toggle state", () => {
  const tree = renderer.create(<ToggleButton title="OwO" isToggled={true} />).toJSON();
  expect(tree).toMatchSnapshot();
});
