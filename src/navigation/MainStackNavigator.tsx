/* istanbul ignore file */

import React from "react";
import { Platform } from "react-native";
import { createStackNavigator, NavigationScreenProps } from "react-navigation";

import AboutScreen from "../screens/AboutScreen";
import HomeScreen from "../screens/HomeScreen";
import PasscodeGateScreen from "../screens/PasscodeGateScreen";
import EditAlarmScreen from "../screens/settings/EditAlarmScreen";
import PasscodeChangeScreen from "../screens/settings/PasscodeChangeScreen";
import DefaultSettingsNavigator from "./DefaultSettingsNavigator";
import ScheduleDetailsNavigator from "./ScheduleDetailsNavigator";

/**
 * Main StackNavigator that handles navigation throughout the app.
 * @author Shawn Lutch, Miika Raina
 */
export default createStackNavigator(
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
            screen: PasscodeChangeScreen
        },

        PasscodeGate: {
            screen: PasscodeGateScreen
        },

        SettingsMain: {
            navigationOptions: { title: "Settings" },
            screen: DefaultSettingsNavigator
        },

        EditSchedule: {
            navigationOptions: ({ navigation }: NavigationScreenProps) => ({
                title: navigation.getParam("title", "Edit Schedule")
            }),
            screen: ScheduleDetailsNavigator
        },

        EditAlarm: {
            screen: EditAlarmScreen
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
