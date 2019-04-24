import * as React from "react";
import renderer from "react-test-renderer";
import {ListHeader} from "../../list";

it("renders correctly", () => {
    expect(renderer.create(<ListHeader title="OwO" />).toJSON()).toMatchSnapshot();
});
