import * as React from "react";
import { IconProps } from "react-native-elements";

export interface PreferenceItemProps<T> {
    value: T;
    disabled: boolean;
    title: string;
    subtitle?: string;
    rightIcon?: Partial<IconProps> | React.ReactElement<{}>;
    onValueChange: (value: T) => void;
    onPress?: () => void;
}

export abstract class PreferenceItem<T> extends React.Component<PreferenceItemProps<T>> {
}
