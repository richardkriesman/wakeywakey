import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";
import { Clock, Message, SlideUpIndicator, SnoozeButton } from "../components/HomeScreen";
import { NoHeader, UIScreen } from "../utils/screen";

/**
 * Home screen properties. Navigation by Miika, intersection type by Richard Kriesman.
 * @author Miika Raina, Richard Kriesman, Shawn Lutch
 */
export interface HomeScreenProps {
    initialMessageText: string;
}

/**
 * Home screen state
 * @author Richard Kriesman
 */
interface HomeScreenState {
    messageText: string;
}

/**
 * The home screen, where the current status, current time, and decorations will show.
 * @author Shawn Lutch, Miika Raina
 */
@NoHeader
export default class HomeScreen extends UIScreen<HomeScreenProps, HomeScreenState> {

    public static defaultInitialMessageText: string = "Hello, world!";

    public constructor(props: HomeScreenProps & NavigationScreenProps) {
        super(props);
    }

    public componentWillMount(): void {
        this.setState({ messageText: "Hello, world!" });
    }

    public renderContent(): ReactNode {
        return (
            <View style={ExtraStyles.container}>
                <View style={ExtraStyles.contentWrapper}>
                    <Message text={this.state.messageText} />
                    <Clock wrapperStyle={ExtraStyles.clockWrapper} />
                    <SnoozeButton onPress={this.onSnoozePressed.bind(this)} />
                </View>
                <View style={ExtraStyles.bottom}>
                    <SlideUpIndicator onPress={this.switchToSettings.bind(this)} />
                </View>
            </View>
        );
    }

    private switchToSettings(): void {
        this.setState({ messageText: "Switch to settings!" });
        this.present("SettingsMain");
    }

    private onSnoozePressed(): void {
        // TODO
        this.setState({ messageText: "Alarm snoozed!" });
    }

}

const ExtraStyles = StyleSheet.create({
    bottom: {
        alignItems: "center",
        bottom: -10,
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        zIndex: 99
    },
    clockWrapper: {},
    container: {
        alignItems: "center",
        flex: 1,
        marginTop: 20,
        padding: 0
    },
    contentWrapper: {
        flex: 1,
        flexBasis: "100%",
        justifyContent: "center",
        width: "85%"
    }
});
