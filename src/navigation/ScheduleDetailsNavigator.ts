import { createBottomTabNavigator, NavigationScreenProps } from "react-navigation";

import ScheduleAlarmsScreen from "../screens/settings/ScheduleAlarmsScreen";
import { ScheduleOptionsScreen } from "../screens/settings/ScheduleOptionsScreen";

const ScheduleDetailScreens = {
    EditSchedule: {
        screen: ScheduleAlarmsScreen
    },

    ScheduleOptions: {
        screen: ScheduleOptionsScreen
    }
};

const ScheduleDetailParams = {
    initialRouteName: "EditSchedule"
};

export default createBottomTabNavigator(ScheduleDetailScreens, ScheduleDetailParams);

export function ScheduleDetailsNavigationOptions({ navigation }: NavigationScreenProps): object {
    return {
        title: navigation.getParam("title", "Edit Schedule")
    };
}
