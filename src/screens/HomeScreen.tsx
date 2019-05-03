/**
 * @module screens
 */

import { PasscodeService } from "../services/PasscodeService";
import * as Log from "../utils/Log";

import { KeepAwake, SplashScreen } from "expo";
import React, { ReactNode } from "react";
import { LayoutChangeEvent, LayoutRectangle, ScrollView, StyleSheet, Text, View } from "react-native";

import { NavigationScreenProps } from "react-navigation";
import { InactivityHandler, Slider } from "../components";
import { Clock, SnoozeButton } from "../components/HomeScreen";
import { PreferenceService } from "../services/PreferenceService";
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
    indicatorLayout?: LayoutRectangle;
    messageText: string;
    twentyFourHour: boolean;
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
        this.state = { messageText: "", twentyFourHour: false };
    }

    public componentWillMount(): void {
        this.refresh().then(() => {
            SplashScreen.hide();
        });
    }

    public renderContent(): ReactNode {

        // render passcode slider once the layout has become available
        let passcodeSlider: ReactNode;
        if (this.height > 0) { // once the screen height is known, it should be greater than 0
            // FIXME: Why are we having to add +11 here? Because I have no idea
            const initialTop: number = this.height -
                (this.state.indicatorLayout ? this.state.indicatorLayout.height : 0) + 11;
            passcodeSlider = (
                <Slider
                    onIndicatorLayout={this.onIndicatorLayout.bind(this)}
                    initialTop={initialTop}>
                    <View style={ExtraStyles.passcodeContainer}>
                        <ScrollView>
                            <Text style={ExtraStyles.passcodeInnerText}>
                                Spongebob me boy, enter that password! Arghegegegegegh
                            </Text>
                            <Text style={ExtraStyles.passcodeInnerText}>
                                Spongebob me boy, enter that password! Arghegegegegegh
                            </Text>
                        </ScrollView>
                    </View>
                </Slider>
            );
        }

        // render screen
        return (
            <InactivityHandler
                idleTime={15000}
                navigation={this.props.navigation}>
                <KeepAwake/>
                <View style={ExtraStyles.container}>
                    <View style={ExtraStyles.contentWrapper}>
                        <Text style={ExtraStyles.message}>{this.state.messageText}</Text>
                        <Clock wrapperStyle={ExtraStyles.clockWrapper} twentyFourHour={this.state.twentyFourHour}/>
                        <SnoozeButton onPress={this.onSnoozePressed.bind(this)}/>
                    </View>
                    {passcodeSlider}
                </View>

            </InactivityHandler>
        );
    }

    public async switchToSettings(): Promise<void> {
        const hasPasscode: boolean = await this.getService(PasscodeService).hasPasscode();
        this.present("PasscodeGate", {
            backButtonName: "Home",
            hasPasscode,
            screen: this,
            successScreenKey: "SettingsMain"
        });
    }

    public onSnoozePressed(): void {
        this.updateState({ messageText: "Alarm snoozed!" });
    }

    protected componentDidLayoutChange(layout: LayoutRectangle): void {
        this.forceUpdate(); // some components depend on the height of the screen - force an update when it changes
    }

    protected componentWillFocus(): void {
        this.refresh().catch(Log.error.bind(this, "HomeScreen"));
    }

    private onIndicatorLayout(event: LayoutChangeEvent): void {
        this.setState({
            indicatorLayout: event.nativeEvent.layout
        });
    }

    private async refresh(): Promise<void> {
        if (!this.getService(PreferenceService)) {
            this.setState({ messageText: this.props.initialMessageText });
            this.forceUpdate();
            return;
        }

        return this.fullDatabaseRead().then(this.updateState.bind(this));
    }

    private async fullDatabaseRead(): Promise<HomeScreenState> {
        const pref: PreferenceService = this.getService(PreferenceService);
        return {
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
    },
    passcodeContainer: {
        alignSelf: "center",
        backgroundColor: "black",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        height: 600,
        width: 300,
        zIndex: 2
    },
    passcodeInnerText: {
        color: "white",
        padding: 50
    }
});
