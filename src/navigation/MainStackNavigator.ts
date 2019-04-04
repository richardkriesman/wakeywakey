import { createStackNavigator, NavigationScreenProps } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import EditAlarmScreen from "../screens/settings/EditAlarmScreen";
import MainSettingsScreen from "../screens/settings/MainSettingsScreen";
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

        SettingsMain: {
            navigationOptions: { title: "Settings" },
            screen: MainSettingsScreen
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
        initialRouteName: "Home",

        initialRouteParams: {
            initialMessageText: HomeScreen.defaultInitialMessageText
        }
    }
);
