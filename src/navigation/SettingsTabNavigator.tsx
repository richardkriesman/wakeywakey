import React from "react";
import { BottomTabNavigatorConfig, createBottomTabNavigator } from "react-navigation";

import { PreferenceListScreen } from "../screens/settings/PreferenceListScreen";
import { ScheduleListScreen } from "../screens/settings/ScheduleListScreen";

const DefaultSettingsScreens = {
    SchedulesList: {
        screen: ScheduleListScreen
    },

    AppSettings: {
        screen: PreferenceListScreen
    }
};

const params: BottomTabNavigatorConfig = {
    initialRouteName: "SchedulesList"
};

export const SettingsTabNavigator = createBottomTabNavigator(DefaultSettingsScreens, params);
