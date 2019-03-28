import React, { ReactNode } from "react";
import { SectionList } from "react-native";
import { NavigationScreenProps, StackActions } from "react-navigation";

import { HeaderAddButton } from "../../components/MainSettingsScreen/HeaderAddButton";
import { ScheduleListHeader } from "../../components/MainSettingsScreen/ScheduleListHeader";
import { ScheduleListItem } from "../../components/MainSettingsScreen/ScheduleListItem";
import { TestAlarms } from "../../models/AlarmModel";
import { ScheduleModel } from "../../models/ScheduleModel";
import { HeaderButtonRight } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";

/**
 * Main settings screen state. Includes schedule states.
 * @author Shawn Lutch
 */
export interface MainSettingsScreenState {
    schedules: ScheduleModel[];
}

/**
 * Properties of each list item.
 * @author Shawn Lutch
 */
export interface SettingsListItemProps {
    title: string;
}

/**
 * Main Settings screen.
 * @author Shawn Lutch, Miika Raina
 */
@HeaderButtonRight((screen) =>
    <HeaderAddButton onPress={() => screen.present("EditSchedule", { title: "Add Schedule" })} />)
export default class MainSettingsScreen extends UIScreen<{}, MainSettingsScreenState> {

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        // TODO properly load schedules from disk
        this.setState({ schedules: testSchedulesList });
    }

    public onScheduleItemToggled(key: number, newEnabled: boolean): void {
        const newSchedules: ScheduleModel[] = this.state.schedules;
        newSchedules[key].enabled = newEnabled;

        if (newEnabled) {
            newSchedules.forEach((s: ScheduleModel) => {
                if (s.key !== key) {
                    s.enabled = false;
                    s.listItemRef.forceEnabled(false);
                }
            });
        }

        this.setState({ schedules: newSchedules });
    }

    public onScheduleItemPressed(key: number): void {
        this.props.navigation.dispatch(StackActions.push({
            params: {
                schedule: this.state.schedules[key],
                title: this.state.schedules[key].name
            },
            routeName: "EditSchedule"
        }));
    }

    public renderContent(): ReactNode {
        return (
            <SectionList
                renderItem={({ item }) => (
                    <ScheduleListItem
                        ref={(me: ScheduleListItem) => {
                            this.state.schedules[item.key].listItemRef = me;
                        }}
                        onPress={this.onScheduleItemPressed.bind(this, item.key)}
                        onSwitchToggled={this.onScheduleItemToggled.bind(this, item.key)}
                        title={item.name}
                        enabled={item.enabled}
                    />
                )}
                renderSectionHeader={({ section }) => <ScheduleListHeader title={section.title}/>}
                sections={[{ data: this.state.schedules, title: "Schedules" }]}
            />
        );
    }
}

// TODO save and load schedules
const testSchedulesList: ScheduleModel[] = [
    {
        alarms: TestAlarms,
        enabled: true,
        key: 0,
        name: "Test Schedule 1"
    },
    {
        alarms: TestAlarms,
        enabled: false,
        key: 1,
        name: "Test Schedule 2"
    }
];
