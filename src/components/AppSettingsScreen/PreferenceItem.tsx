import * as React from "react";
import { IconProps, ListItem, ListItemProps } from "react-native-elements";

export interface PreferenceItemProps<T> {
    value?: T;
    disabled: boolean;
    title: string;
    subtitle?: string;
    rightIcon?: Partial<IconProps> | React.ReactElement<{}>;
    onValueChange: (value: T) => void;
    onPress?: () => void;
}

export abstract class PreferenceItem<T> extends React.Component<PreferenceItemProps<T>> {
    public render(): React.ReactNode {
        return (
            <ListItem
                title={this.props.title}
                subtitle={this.props.subtitle}
                rightIcon={this.props.rightIcon}
                onPress={this.props.onPress}
                {...this.extraProps()}
            />
        );
    }

    protected abstract extraProps(): Partial<ListItemProps>;
}
