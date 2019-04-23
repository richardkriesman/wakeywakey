import * as React from "react";
import { ListItem } from "react-native-elements";
import { PreferenceItem } from "./PreferenceItem";

export class BooleanPreference extends PreferenceItem<boolean> {
    public render(): React.ReactNode {
        return (
            <ListItem
                title={this.props.title}
                subtitle={this.props.subtitle}
                rightIcon={this.props.rightIcon}
                switch={{
                    disabled: this.props.disabled,
                    onValueChange: this.props.onValueChange,
                    value: this.props.value
                }}
            />
        );
    }
}
