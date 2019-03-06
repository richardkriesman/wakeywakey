import React, { ReactNode } from "react";
import { View, StyleSheet } from "react-native";

import { Message, Clock, SnoozeButton, SlideUpIndicator } from "../components/HomeScreen";

interface HomeScreenProps {
    initialMessageText : string;
}

interface HomeScreenState {
    messageText : string;
}

/**
 * The home screen, where the current status, current time, and decorations will show.
 * 
 * @author Shawn Lutch
 */
export default class HomeScreen extends React.Component<HomeScreenProps, HomeScreenState> {

    static defaultInitialMessageText : string = "Hello, world!";

    public constructor(props : HomeScreenProps) {
        super(props);

        this.state = {
            messageText: this.props.initialMessageText
        }
    }

    private switchToSettings() : void {
        // TODO
        this.setState({ messageText: "Switch to settings!" });
    }

    private onSnoozePressed() : void {
        // TODO
        this.setState({ messageText: "Alarm snoozed!" });
    }

    public render() : ReactNode {
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

};

const ExtraStyles = StyleSheet.create({
    container: {
        marginTop: 20,
        padding: 0,
        flex: 1,
        alignItems: 'center'
    },
    contentWrapper: {
        flex: 1,
        flexBasis: '100%',
        justifyContent: 'center',
        width: '85%',
    },
    clockWrapper: {
        
    },
    bottom: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        position: 'absolute',
        bottom: -10,
        width: '100%'
    }
});
