import * as React from "react";
import renderer from "react-test-renderer";
import {ListHeader} from "../index";

it("renders correctly", () => {
    expect(renderer.create(<ListHeader title="OwO" />).toJSON()).toMatchSnapshot();
});
