import React from "react";
import { Platform, StyleSheet } from "react-native";
import { ListItemProps } from "react-native-elements";
import { ListItem as ElementsListItem } from "react-native-elements";

import Colors from "../../constants/Colors";

export class ListItem extends React.Component<ListItemProps & { subtitleStyle?: never }> {

    public render(): React.ReactNode {
        const props: ListItemProps & { subtitleStyle?: never } = this.props; // copy props so we can modify them

        // if item has a switch, overwrite its styling (or lack thereof) with the app's styling
        if (props.switch) {
            props.switch.trackColor = Platform.OS === "ios" ? Colors.ios.switch.track : Colors.android.switch.track;
            if (Platform.OS === "android" && props.switch.value) {
                props.switch.thumbColor = Colors.android.switch.thumb.true;
            }
        }

        return (
            <ElementsListItem
                {...props}
                subtitleStyle={styles.subtitle} />
        );
    }

}

const styles = StyleSheet.create({
    subtitle: {
        color: Colors.common.text.subheader
    }
});
