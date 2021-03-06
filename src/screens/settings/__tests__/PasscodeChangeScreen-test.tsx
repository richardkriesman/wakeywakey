import React from "react";
import "react-native";
import renderer from "react-test-renderer";
import {TestEnvironment} from "../../../utils/testing";
import { PasscodeEditScreen } from "../PasscodeEditScreen";

let env: TestEnvironment;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;
            done();
        });
});

it("renders correctly", () => {
    const tree = renderer.create(
        <PasscodeEditScreen {...env.emptyUIScreenProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

it("passcode is set successfully", (done) => {
    const component: any = renderer.create(
        <PasscodeEditScreen {...env.emptyUIScreenProps} />)
        .getInstance();

    component.handleSuccess("1234")
        .then(() => {
            try {
                expect((env.db as any).mockPreferences).toHaveProperty("passcode");
                expect((env.db as any).mockPreferences.passcode).toBe("1234");
            } catch (err) {
                done.fail(err);
            }

            // FIXME: Figure out how to check if UIScreen.dismiss() was called?
            // expect(env.navigationProp.dispatch).toBeCalled();
            // expect(env.navigationProp.dispatch).lastCalledWith({
            //     routeName: "SettingsMain",
            //     type: "Navigation/REPLACE"
            // });

            done();
        });
});
