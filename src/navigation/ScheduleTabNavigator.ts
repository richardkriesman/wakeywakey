import { BottomTabNavigatorConfig, createBottomTabNavigator } from "react-navigation";

import { AlarmListScreen } from "../screens/settings/AlarmListScreen";
import { OptionsListScreen } from "../screens/settings/OptionsListScreen";

const ScheduleDetailScreens = {
    AlarmList: {
        screen: AlarmListScreen
    },

    OptionsList: {
        screen: OptionsListScreen
    }
};

const ScheduleDetailParams: BottomTabNavigatorConfig = {
    initialRouteName: "AlarmList"
};

export const ScheduleTabNavigator = createBottomTabNavigator(ScheduleDetailScreens, ScheduleDetailParams);
