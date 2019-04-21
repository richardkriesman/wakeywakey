import * as React from "react";
import renderer from "react-test-renderer";
import { TestEnvironment } from "../../../utils/testing";
import { HomeScreenClock } from "../HomeScreenClock";

describe("HomeScreenClock", () => {

    let env: TestEnvironment;
    beforeEach(async (done) => {
        env = await TestEnvironment.init();
        env.timing.date = 0;
        done();
    });

    it("renders the correct (fake) initial time", () => {
        const tree = renderer.create(<HomeScreenClock/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders the correct (fake) later time", () => {
        env.timing.date = 1000;
        const tree = renderer.create(<HomeScreenClock/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
