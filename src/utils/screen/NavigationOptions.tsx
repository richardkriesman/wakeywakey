import * as React from "react";
import { NavigationScreenProps } from "react-navigation";
import { UIScreen } from "./UIScreen";

declare type NavigationOptionSetter<T> = (screen: UIScreen) => T;

/**
 * Sets the left header button
 */
export function HeaderButtonLeft(fn: NavigationOptionSetter<React.ReactElement>) {
    return function<T>(constructor: T) {
        const currentNavOptions = (constructor as any).navigationOptions;
        (constructor as any).navigationOptions = ({ navigation }: NavigationScreenProps) => {
            const screen: UIScreen = navigation.getParam("screen");
            return {
                ...currentNavOptions({navigation}),
                headerLeft: fn(screen)
            };
        };
    };
}

/**
 * Sets the right header button
 */
export function HeaderButtonRight(fn: NavigationOptionSetter<React.ReactElement>) {
    return function<T>(constructor: T) {
        const currentNavOptions = (constructor as any).navigationOptions;
        (constructor as any).navigationOptions = ({ navigation }: NavigationScreenProps) => {
            const screen: UIScreen = navigation.getParam("screen");
            return {
                ...currentNavOptions({navigation}),
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
    return function<T>(constructor: T) {
        const currentNavOptions = (constructor as any).navigationOptions;
        (constructor as any).navigationOptions = ({ navigation }: NavigationScreenProps) => {
            const paramTitle: string|undefined = navigation.getParam("title");
            const displayTitle: string = paramTitle ? paramTitle : title;
            return {
                ...currentNavOptions({navigation}),
                title: displayTitle
            };
        };
    };
}
