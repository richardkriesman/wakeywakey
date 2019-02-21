/* tslint:disable:max-classes-per-file - this is just a typedef file, there's no actual code here */

// react-navigation test utilities
declare module "react-navigation/NavigationTestUtils" {
    export function resetInternalState(): void;
}

// overwrite the expo type declaration
declare module "expo" {

    // add the Icon module from @expo/vector-icons - it isn't defined in the DefinitelyTyped typedefs
    export { default as Icon } from "@expo/vector-icons";

    // we're extending the DefinitelyTyped typedefs
    export * from "@types/expo";
}

// expo sample views
declare module "@expo/samples" {
    declare class ExpoLinksView extends React.Component {}
    declare class ExpoConfigView extends React.Component {}
}
