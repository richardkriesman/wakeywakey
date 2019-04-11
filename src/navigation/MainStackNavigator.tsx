/* istanbul ignore file */

import React from "react";
import { createStackNavigator, NavigationScreenProps } from "react-navigation";

import { HeaderIconButton } from "../components/HeaderIconButton";
import HomeScreen from "../screens/HomeScreen";
import EditAlarmScreen from "../screens/settings/EditAlarmScreen";
import MainSettingsScreen from "../screens/settings/MainSettingsScreen";
import PasscodeChangeScreen from "../screens/settings/PasscodeChangeScreen";
import { UIScreen } from "../utils/screen/UIScreen";
import ScheduleDetailsNavigator from "./ScheduleDetailsNavigator";

/**
 * Main StackNavigator that handles navigation throughout the app.
 * @author Shawn Lutch, Miika Raina
 */
export default createStackNavigator(
    // screen stack
    {
        Home: {
            navigationOptions: {
                title: "Home"
            },
            screen: HomeScreen
        },

        PasscodeChange: {
            screen: PasscodeChangeScreen
        },

        SettingsMain: {
            navigationOptions: { title: "Settings" },
            screen: MainSettingsScreen
        },

        EditSchedule: {
            navigationOptions: ({ navigation }: NavigationScreenProps) => ({
                headerRight: <HeaderIconButton
                    icon="add"
                    onPress={() => {

                        /*
                         * This is perpetuating my terrible hack for navigation option decorators as well, but it's
                         * the only way I can think of for getting a UIScreen in here, and we can't use decorators
                         * because the header is on the tab navigator.
                         *
                         * In fact, we're getting double the fun here because the tab navigator isn't a UIScreen and
                         * therefore doesn't have a "screen" param. So we're now having to get this from whatever is
                         * presenting it. How fun!
                         */
                        const screen: UIScreen = navigation.getParam("screen");

                        // present the edit alarm screen
                        screen.present("EditAlarm", { title: "Add Alarm" });

                    }} />,
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
        initialRouteName: "Home",

        initialRouteParams: {
            initialMessageText: HomeScreen.defaultInitialMessageText
        }
    }
);
