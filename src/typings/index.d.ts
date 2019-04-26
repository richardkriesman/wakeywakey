/* tslint:disable:max-classes-per-file - this is just a typedef file, there's no actual code here */
/* tslint:disable:interface-over-type-literal - we need to be able to define types here */

// react-navigation test utilities
declare module "react-navigation/NavigationTestUtils" {
    export function resetInternalState(): void;
}

// overwrite the expo type declaration
declare module "expo" {

    // add the Icon module from @expo/vector-icons - it isn't defined in the DefinitelyTyped typedefs
    export { default as Icon } from "@expo/vector-icons";

    export namespace SplashScreen {
        function preventAutoHide(): void;
        function hide(): void;
    }

    // we're extending the DefinitelyTyped typedefs
    export * from "@types/expo";
}

// expo sample views
declare module "@expo/samples" {
    import * as React from "react";

    declare class ExpoLinksView extends React.Component {}
    declare class ExpoConfigView extends React.Component {}
}

// getting an error on my end. hoping to clear it up. sL
declare module "@expo/vector-icons";

// Getting an error, pls work
declare module "react-native-vertical-swipe";

declare type InstanceType<T extends new(...args: any[]) => any> =
    T extends new(...args: any[]) => infer R ? R : any;
