import { BottomTabNavigatorConfig, createBottomTabNavigator } from "react-navigation";
import Colors from "../constants/Colors";

import ScheduleAlarmsScreen from "../screens/settings/ScheduleAlarmsScreen";
import { ScheduleOptionsScreen } from "../screens/settings/ScheduleOptionsScreen";

const tabBarOptions = {
    activeTintColor: Colors.appleButtonBlue,
    inactiveTintColor: "gray"
};

const ScheduleDetailScreens = {
    ScheduleAlarms: {
        navigationOptions: {
            tabBarOptions,
            title: "Alarms"
        },
        screen: ScheduleAlarmsScreen
    },

    ScheduleOptions: {
        navigationOptions: {
            tabBarOptions,
            title: "Options"
        },
        screen: ScheduleOptionsScreen
    }
};

const ScheduleDetailParams: BottomTabNavigatorConfig = {
    initialRouteName: "ScheduleAlarms"
};

export default createBottomTabNavigator(ScheduleDetailScreens, ScheduleDetailParams);
