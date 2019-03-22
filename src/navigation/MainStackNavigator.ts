import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import EditAlarmScreen from "../screens/settings/EditAlarmScreen";
import MainSettingsScreen from "../screens/settings/MainSettingsScreen";

/**
 * Main StackNavigator that handles navigation throughout the app.
 * @author Shawn Lutch, Miika Raina
 */
export default createStackNavigator(

    // screen stack
    {
        Home: {
            screen: HomeScreen
        },

        SettingsMain: {
            navigationOptions: { title: "Settings" },
            screen: MainSettingsScreen
        },

        EditAlarm: {
            screen: EditAlarmScreen
        }
    },

    // stack config
    {
        initialRouteParams: {
            initialMessageText: HomeScreen.defaultInitialMessageText
        }
    }
);
