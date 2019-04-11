import * as React from "react";
import { BottomTabNavigatorConfig, createBottomTabNavigator, NavigationScreenProps } from "react-navigation";

import ScheduleAlarmsScreen from "../screens/settings/ScheduleAlarmsScreen";
import { ScheduleOptionsScreen } from "../screens/settings/ScheduleOptionsScreen";

const ScheduleDetailScreens = {
    ScheduleAlarms: {
        screen: (props: NavigationScreenProps) => <ScheduleAlarmsScreen {...props} />
    },

    ScheduleOptions: {
        screen: (props: NavigationScreenProps) => <ScheduleOptionsScreen {...props} />
    }
};

const ScheduleDetailParams: BottomTabNavigatorConfig = {
    initialRouteName: "ScheduleAlarms"
};

export default createBottomTabNavigator(ScheduleDetailScreens, ScheduleDetailParams);
