import React from "react";
import { BottomTabNavigatorConfig, createBottomTabNavigator } from "react-navigation";
import { AppSettingsScreen } from "../screens/settings/AppSettingsScreen";

import SchedulesListScreen from "../screens/settings/SchedulesListScreen";

const DefaultSettingsScreens = {
    SchedulesList: {
        screen: SchedulesListScreen
    },

    AppSettings: {
        screen: AppSettingsScreen
    }
};

const params: BottomTabNavigatorConfig = {
    initialRouteName: "SchedulesList"
};

export default createBottomTabNavigator(DefaultSettingsScreens, params);
