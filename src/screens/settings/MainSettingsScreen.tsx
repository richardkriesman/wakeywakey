import React, { ReactNode } from "react";
import { SectionList } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { HeaderAddButton } from "../../components/MainSettingsScreen/HeaderAddButton";
import { ScheduleListHeader } from "../../components/MainSettingsScreen/ScheduleListHeader";
import { ScheduleListItem } from "../../components/MainSettingsScreen/ScheduleListItem";

/**
 * Main settings screen state. Includes schedule states.
 * @author Shawn Lutch
 */
export interface MainSettingsScreenState {
    schedules: MainSettingsScreenSchedulesState[];
}

/**
 * (Hopefully temporary) schedules state.
 * @author Shawn Lutch
 */
export interface MainSettingsScreenSchedulesState {
    enabled: boolean;
    key: number;
    name: string;
    ref?: ScheduleListItem;
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
export default class MainSettingsScreen
    extends React.Component<NavigationScreenProps, MainSettingsScreenState> {

    public static navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            headerRight: (
                <HeaderAddButton
                    // TODO instead navigate to "Add Alarm" with proper params
                    onPress={() => {
                        navigation.navigate(
                            "EditSchedule",
                            { title: "rawr XD *nuzzles you*" }
                        );
                    }}
                />
            )
        };
    }

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        // TODO properly load schedules from disk
        this.setState({ schedules: testSchedulesList });
    }

    public onScheduleItemToggled(key: number, newEnabled: boolean): void {
        const newSchedules: MainSettingsScreenSchedulesState[] = this.state.schedules;
        newSchedules[key].enabled = newEnabled;

        if (newEnabled) {
            newSchedules.forEach((s: MainSettingsScreenSchedulesState) => {
                if (s.key !== key) {
                    s.enabled = false;
                    s.ref.forceEnabled(false);
                }
            });
        }

        this.setState({ schedules: newSchedules });
    }

    public render(): ReactNode {
        return (
            <SectionList
                renderItem={({ item }) => (
                    <ScheduleListItem
                        ref={(me: ScheduleListItem) => { this.state.schedules[item.key].ref = me; }}
                        onSwitchToggled={this.onScheduleItemToggled.bind(this, item.key)}
                        title={item.name}
                        enabled={item.enabled}
                    />
                )}
                renderSectionHeader={({section}) => <ScheduleListHeader title={section.title} />}
                sections={[ { data: this.state.schedules , title: "Schedules" } ]}
            />
        );
    }
}

// TODO save and load schedules
const testSchedulesList: MainSettingsScreenSchedulesState[] = [
    {
        enabled: true,
        key: 0,
        name: "Test Schedule 1"
    },
    {
        enabled: false,
        key: 1,
        name: "Test Schedule 2"
    }
];
