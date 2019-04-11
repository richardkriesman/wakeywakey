import * as React from "react";
import { BottomTabNavigatorConfig, createBottomTabNavigator } from "react-navigation";

import ScheduleAlarmsScreen from "../screens/settings/ScheduleAlarmsScreen";
import { ScheduleOptionsScreen } from "../screens/settings/ScheduleOptionsScreen";

const ScheduleDetailScreens = {
    ScheduleAlarms: {
        screen: ScheduleAlarmsScreen
    },

    ScheduleOptions: {
        screen: ScheduleOptionsScreen
    }
};

const ScheduleDetailParams: BottomTabNavigatorConfig = {
    initialRouteName: "ScheduleAlarms"
};

export default createBottomTabNavigator(ScheduleDetailScreens, ScheduleDetailParams);
