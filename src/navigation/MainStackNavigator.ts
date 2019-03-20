import { createStackNavigator, NavigationScreenProps } from "react-navigation";

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
            // headerBackTitle does not work. -sL 2019/03/08
            navigationOptions: ({ navigation }: NavigationScreenProps) => {
                return {
                    headerBackTitle: "Done",
                    title: "Settings"
                };
            },
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
