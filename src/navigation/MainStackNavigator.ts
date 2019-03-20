import { createStackNavigator } from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
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
        }
    },

    // stack config
    {
        initialRouteParams: {
            initialMessageText: HomeScreen.defaultInitialMessageText
        }
    }
);
