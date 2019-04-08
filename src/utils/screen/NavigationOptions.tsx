/**
 * @module utils
 */

import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { TabBarIcon } from "../../components";
import { UIScreen } from "./UIScreen";

declare type NavigationOptionSetter<T> = (screen: UIScreen) => T;

/**
 * Sets the left header button
 */
export function HeaderButtonLeft(fn: NavigationOptionSetter<React.ReactElement>) {
    return function <T>(constructor: T) {
        const currentNavOptions = (constructor as any).navigationOptions;
        (constructor as any).navigationOptions = ({ navigation }: NavigationScreenProps) => {
            const screen: UIScreen = navigation.getParam("screen");
            return {
                ...currentNavOptions({ navigation }),
                headerLeft: fn(screen)
            };
        };
    };
}

/**
 * Sets the right header button
 */
export function HeaderButtonRight(fn: NavigationOptionSetter<React.ReactElement>) {
    return function <T>(constructor: T) {
        const currentNavOptions = (constructor as any).navigationOptions;
        (constructor as any).navigationOptions = ({ navigation }: NavigationScreenProps) => {
            const screen: UIScreen = navigation.getParam("screen");
            return {
                ...currentNavOptions({ navigation }),
                headerRight: fn(screen)
            };
        };
    };
}

/**
 * Removes the screen's header
 */
export function NoHeader<T>(constructor: T) {
    const currentNavOptions = (constructor as any).navigationOptions;
    (constructor as any).navigationOptions = ({ navigation }: NavigationScreenProps) => {
        return {
            ...currentNavOptions({ navigation }),
            header: null
        };
    };
}

/**
 * Sets the title of the screen
 */
export function Title(title: string) {
    return function <T>(constructor: T) {
        const currentNavOptions = (constructor as any).navigationOptions;
        (constructor as any).navigationOptions = ({ navigation }: NavigationScreenProps) => {
            const paramTitle: string | undefined = navigation.getParam("title");
            // reversed to prioritize decorator parameter over navigation parameter - sL 2019 04 03
            const displayTitle: string = title ? title : paramTitle;
            return {
                ...currentNavOptions({ navigation }),
                title: displayTitle
            };
        };
    };
}

// TODO find the proper typedef from react-navigation
interface TabBarIconState {
    tintColor?: string;
    focused: boolean;
}

/**
 * Set the bottom tab bar icon for the screen
 * @param name Name of the icon
 * @param show Whether to show the icon. Default: true
 * @author Shawn Lutch
 */
export function BottomTabBarIcon(name: string, show: boolean = true) {
    return function <T>(constructor: T) {
        const currentNavOptions = (constructor as any).navigationOptions;
        (constructor as any).navigationOptions = ({ navigation }: NavigationScreenProps) => {
            return {
                ...currentNavOptions({ navigation }),
                tabBarIcon: ({ tintColor, focused }: TabBarIconState) => (
                    <TabBarIcon name={name} focused={focused}/>
                ),
                tabBarOptions: {
                    showIcon: show
                }
            };
        };
    };
}
