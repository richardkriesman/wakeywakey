/**
 * @module screens
 */

import { KeepAwake, SplashScreen } from "expo";
import React, { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationScreenProps } from "react-navigation";
import { EmptyView } from "../components/EmptyView";
import { Clock, SlideUpIndicator, SnoozeButton } from "../components/HomeScreen";
import { InactivityHandler } from "../components/InactivityHandler";
import { PreferencesService } from "../services/PreferencesService";
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
    twentyFourHour: boolean;
    loaded: boolean;
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
        this.state = { loaded: false, messageText: "", twentyFourHour: false };
    }

    public componentWillMount(): void {
        this.refresh().then(() => {
            SplashScreen.hide();
        });
    }

    public renderContent(): ReactNode {
        const loadedContent = (
            <View style={ExtraStyles.contentWrapper}>
                <Text style={ExtraStyles.message}>{this.state.messageText}</Text>
                <Clock wrapperStyle={ExtraStyles.clockWrapper} twentyFourHour={this.state.twentyFourHour}/>
                <SnoozeButton onPress={this.onSnoozePressed.bind(this)}/>
            </View>
        );

        const notLoadedContent = <EmptyView icon="ios-cog" title="Loading" subtitle="Just a sec!"/>;

        return (
            <InactivityHandler
                idleTime={15000}
                navigation={this.props.navigation}>
                <KeepAwake/>
                <View style={ExtraStyles.container}>
                    {this.state.loaded ? loadedContent : notLoadedContent}
                    <View style={ExtraStyles.bottom}>
                        <SlideUpIndicator onPress={this.switchToSettings.bind(this)}/>
                    </View>
                </View>
            </InactivityHandler>
        );
    }

    public switchToSettings(): void {
        this.present("SettingsMain", { screen: this });
    }

    public onSnoozePressed(): void {
        this.updateState({ messageText: "Alarm snoozed!" });
    }

    protected componentWillFocus(): void {
        this.refresh();
    }

    private async refresh(): Promise<void> {
        if (!this.getService(PreferencesService)) {
            this.setState({ messageText: this.props.initialMessageText });
            this.forceUpdate();
            return;
        }

        return this.fullDatabaseRead().then(this.updateState.bind(this));
    }

    private async fullDatabaseRead(): Promise<HomeScreenState> {
        const pref: PreferencesService = this.getService(PreferencesService);
        return {
            loaded: true,
            messageText: "Hello, world!",
            twentyFourHour: await pref.get24HourTime()
        };
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
        marginTop: 20,
        padding: 0
    },
    contentWrapper: {
        flex: 1,
        flexBasis: "100%",
        justifyContent: "center",
        width: "85%"
    },
    message: {
        fontSize: 30,
        textAlign: "center"
    }
});
