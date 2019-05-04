import React from "react";
import renderer from "react-test-renderer";

import { TestEnvironment } from "../../../utils/testing";
import { BooleanPreference } from "../BooleanPreference";

const fakeDateMillis = 1551896555862;

let env: TestEnvironment;
beforeEach(async (done) => {
    env = await TestEnvironment.init();
    env.timing.date = fakeDateMillis;
    done();
});

it("renders properly", () => {
    const cb = jest.fn();

    const elems = [
        <BooleanPreference value={true} disabled={false} title="Test 1" onValueChange={cb}/>,
        <BooleanPreference value={false} disabled={false} title="Test 2" onValueChange={cb}/>,
        <BooleanPreference value={true} disabled={true} title="Test 3" onValueChange={cb}/>,
        <BooleanPreference value={false} disabled={true} title="Test 4" onValueChange={cb}/>
    ];

    elems.forEach((e) => {
        expect(renderer.create(e).toJSON()).toMatchSnapshot();
    });
});
