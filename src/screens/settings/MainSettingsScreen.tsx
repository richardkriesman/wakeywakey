import React, { ReactNode } from "react";
import { SectionList, StyleSheet } from "react-native";
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
                    onPress={() => { navigation.navigate("Home"); }}
                />
            )
        };
    }

    public constructor(props: NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        // TODO proper state handling
        this.setState({ schedules: testSchedulesList });
    }

    public render(): ReactNode {
        return (
            <SectionList
                renderItem={({item}) => <ScheduleListItem title={item.name} enabled={item.enabled} />}
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
