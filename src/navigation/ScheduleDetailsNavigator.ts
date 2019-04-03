import { createBottomTabNavigator, NavigationScreenProps } from "react-navigation";

import EditScheduleScreen from "../screens/settings/EditScheduleScreen";
import { ScheduleOptionsScreen } from "../screens/settings/ScheduleOptionsScreen";

const ScheduleDetailScreens = {
    EditSchedule: {
        screen: EditScheduleScreen
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
