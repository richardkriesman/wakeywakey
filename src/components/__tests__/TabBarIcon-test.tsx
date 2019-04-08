import * as React from "react";
import Renderer from "react-test-renderer";
import { TabBarIcon, TabBarIconProps } from "../TabBarIcon";

function createTestProps(focused: boolean): TabBarIconProps {
    return {
        focused,
        name: "ios-checkmark-circle-outline"
    };
}

describe("TabBarIcon", () => {

    it("matches snapshot focused", () => {
        const props = createTestProps(true);
        const json = Renderer.create(<TabBarIcon {...props} />).toJSON();
        expect(json).toMatchSnapshot();
    });

    it("matches snapshot unfocused", () => {
        const props = createTestProps(false);
        const json = Renderer.create(<TabBarIcon {...props} />).toJSON();
        expect(json).toMatchSnapshot();
    });

});
