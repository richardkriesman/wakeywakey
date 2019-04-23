import React from "react";
import { BottomTabNavigatorConfig, createBottomTabNavigator, NavigationScreenProps } from "react-navigation";
import { HeaderIconButton } from "../components/HeaderIconButton";
import { Schedule } from "../models/Schedule";
import { AppSettingsScreen } from "../screens/settings/AppSettingsScreen";

import SchedulesListScreen from "../screens/settings/SchedulesListScreen";
import { UIScreen } from "../utils/screen/UIScreen";

const DefaultSettingsScreens = {
    SchedulesList: {
        navigationOptions: ({ navigation }: NavigationScreenProps) => ({
            headerRight: <HeaderIconButton
                icon="add"
                onPress={() => {

                    /*
                     * I'm going to be honest I copied and pasted and tweaked this from Richard's example on the
                     * MainStackNavigator. -sL
                     */
                    const screen: UIScreen = navigation.getParam("screen");
                    const schedule: Schedule = navigation.getParam("schedule");

                    // present the edit alarm screen
                    screen.present("EditSchedule", {
                        schedule,
                        title: "Add Schedule"
                    });

                }} />,
            title: navigation.getParam("title", "Schedules")
        }),
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
