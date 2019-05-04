import { BottomTabNavigatorConfig, createBottomTabNavigator } from "react-navigation";

import { AlarmListScreen } from "../screens/settings/AlarmListScreen";
import { OptionsListScreen } from "../screens/settings/OptionsListScreen";

const ScheduleDetailScreens = {
    ScheduleAlarms: {
        screen: AlarmListScreen
    },

    ScheduleOptions: {
        screen: OptionsListScreen
    }
};

const ScheduleDetailParams: BottomTabNavigatorConfig = {
    initialRouteName: "ScheduleAlarms"
};

export const ScheduleTabNavigator = createBottomTabNavigator(ScheduleDetailScreens, ScheduleDetailParams);
