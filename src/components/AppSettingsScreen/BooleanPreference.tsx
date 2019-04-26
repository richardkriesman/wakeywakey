import * as React from "react";
import { ListItemProps } from "react-native-elements";
import { PreferenceItem, PreferenceItemProps } from "./PreferenceItem";

export interface BooleanPreferenceProps extends PreferenceItemProps<boolean> {
    onValueChange: (value: boolean) => void;
}

export class BooleanPreference extends PreferenceItem<BooleanPreferenceProps> {
    protected extraProps(): Partial<ListItemProps> {
        return {
            switch: {
                disabled: this.props.disabled,
                onValueChange: this.props.onValueChange,
                value: this.props.value
            }
        };
    }
}
