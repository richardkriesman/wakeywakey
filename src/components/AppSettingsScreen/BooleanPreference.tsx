import * as React from "react";
import { ListItemProps } from "react-native-elements";
import { PreferenceItem } from "./PreferenceItem";

export class BooleanPreference extends PreferenceItem<boolean> {
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
