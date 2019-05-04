import React from "react";
import { BottomTabNavigatorConfig, createBottomTabNavigator } from "react-navigation";

import { PreferenceListScreen } from "../screens/settings/PreferenceListScreen";
import { ScheduleListScreen } from "../screens/settings/ScheduleListScreen";

const DefaultSettingsScreens = {
    ScheduleList: {
        screen: ScheduleListScreen
    },

    PreferenceList: {
        screen: PreferenceListScreen
    }
};

const params: BottomTabNavigatorConfig = {
    initialRouteName: "ScheduleList"
};

export const SettingsTabNavigator = createBottomTabNavigator(DefaultSettingsScreens, params);
