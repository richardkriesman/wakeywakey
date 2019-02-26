import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator, createStackNavigator } from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens.tsx/HomeScreen";
import LinksScreen from "../screens.tsx/LinksScreen";
import SettingsScreen from "../screens.tsx/SettingsScreen";

const HomeStack = createStackNavigator({
    Home: HomeScreen,
});

HomeStack.navigationOptions = {
    tabBarIcon: ({ focused }: { focused: boolean }) => (
        <TabBarIcon
            focused={focused}
            name={
                Platform.OS === "ios"
                    ? `ios-information-circle${focused ? "" : "-outline"}`
                    : "md-information-circle"
            }
        />
    ),
    tabBarLabel: "Home"
};

const LinksStack = createStackNavigator({
    Links: LinksScreen,
});

LinksStack.navigationOptions = {
    tabBarIcon: ({ focused }: { focused: boolean }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-link" : "md-link"}
        />
    ),
    tabBarLabel: "Links"
};

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
    tabBarIcon: ({ focused }: { focused: boolean }) => (
        <TabBarIcon
            focused={focused}
            name={Platform.OS === "ios" ? "ios-options" : "md-options"}
        />
    ),
    tabBarLabel: "Settings"
};

export default createBottomTabNavigator({
    HomeStack,
    LinksStack,
    SettingsStack,
});
