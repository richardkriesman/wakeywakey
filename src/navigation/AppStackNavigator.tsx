/* istanbul ignore file */

import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, NavigationScreenProps } from "react-navigation";

import { AboutScreen } from "../screens/AboutScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { PasscodeGateScreen } from "../screens/PasscodeGateScreen";
import { AlarmEditScreen } from "../screens/settings/AlarmEditScreen";
import { PasscodeEditScreen } from "../screens/settings/PasscodeEditScreen";
import { ScheduleTabNavigator } from "./ScheduleTabNavigator";
import { SettingsTabNavigator } from "./SettingsTabNavigator";

/**
 * Main StackNavigator that handles navigation throughout the app.
 * @author Shawn Lutch, Miika Raina
 */
export const AppStackNavigator = createStackNavigator(
    // screen stack
    {
        About: {
            navigationOptions: {
                title: "About WakeyWakey"
            },
            screen: AboutScreen
        },

        Home: {
            navigationOptions: {
                title: "Home"
            },
            screen: HomeScreen
        },

        PasscodeChange: {
            screen: PasscodeEditScreen
        },

        PasscodeGate: {
            screen: PasscodeGateScreen
        },

        SettingsMain: {
            navigationOptions: { title: "Settings" },
            screen: SettingsTabNavigator
        },

        EditSchedule: {
            navigationOptions: ({ navigation }: NavigationScreenProps) => ({
                title: navigation.getParam("title", "Edit Schedule")
            }),
            screen: ScheduleTabNavigator
        },

        EditAlarm: {
            screen: AlarmEditScreen
        }

    },

    // stack config
    {
        defaultNavigationOptions: {
            headerTitleStyle: {
                ...Platform.select({
                    android: {
                        fontFamily: "Roboto"
                    },
                    ios: {}
                })
            }
        },

        initialRouteName: "Home",

        initialRouteParams: {
            initialMessageText: HomeScreen.defaultInitialMessageText
        }
    }
);
