import {ExpoConfigView} from "@expo/samples";
import React, {ReactNode} from "react";
import {NavigationScreenOptions} from "react-navigation";

export default class SettingsScreen extends React.Component {
    public static navigationOptions: NavigationScreenOptions = {
        title: "app.json",
    };

    public render(): ReactNode {
        /* Go ahead and delete ExpoConfigView and replace it with your
         * content, we just wanted to give you a quick view of your config */
        return <ExpoConfigView/>;
    }
}
