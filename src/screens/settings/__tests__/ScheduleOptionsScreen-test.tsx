import * as React from "react";
import renderer from "react-test-renderer";
import { Schedule } from "../../../models";
import { ScheduleService } from "../../../services";
import { TestEnvironment } from "../../../utils/testing";
import { OptionsListScreen } from "../OptionsListScreen";

jest.mock("../../../services/ScheduleService");

let env: TestEnvironment;
let schedule: Schedule;
beforeEach((done) => {
    TestEnvironment.init()
        .then((newEnv) => {
            env = newEnv;

            // create a new schedule
            return env.db.getService(ScheduleService).create("Test schedule");
        })
        .then((newSchedule) => {
            schedule = newSchedule;
            done();
        });
});

it("renders correctly", () => {

    // build props
    const props = env.emptyUIScreenProps;
    props.navigation.setParams({ schedule });

    // render the tree
    const tree = renderer.create(<OptionsListScreen {...props}/>);
    expect(tree.toJSON()).toMatchSnapshot();

});
