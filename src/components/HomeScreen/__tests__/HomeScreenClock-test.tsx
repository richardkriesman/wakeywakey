import * as React from "react";
import renderer from "react-test-renderer";
import { HomeScreenClock } from "../HomeScreenClock";

import MockDate from "mockdate";

describe("HomeScreenClock", () => {

    jest.useFakeTimers();
    const fakeDateMillis = 1551896555862;

    beforeEach(() => {
        MockDate.set(fakeDateMillis);
    });

    it("renders the correct (fake) initial time", () => {
        const tree = renderer.create(<HomeScreenClock/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it("renders the correct (fake) later time", () => {
        MockDate.set(fakeDateMillis + 60000);
        const tree = renderer.create(<HomeScreenClock/>).toJSON();
        expect(tree).toMatchSnapshot();
    });

});
