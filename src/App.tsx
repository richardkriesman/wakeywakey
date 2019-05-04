/**
 * @module app
 */

import { AppLoading, Font, SplashScreen } from "expo";
import React, { ReactNode } from "react";
import { ErrorHandlerCallback, Platform, StatusBar, StyleSheet, View } from "react-native";

import { AppContainer } from "./navigation/AppContainer";
import { AppDatabase } from "./utils/AppDatabase";
import * as Log from "./utils/Log";

export interface AppProps {
    db?: AppDatabase;
    skipLoadingScreen?: boolean;
}

export interface AppState {
    db: AppDatabase;
    isLoadingComplete: boolean;
}

export class App extends React.Component<AppProps, AppState> {

    private static async loadResources(): Promise<void> {
        await Font.loadAsync({
            "space-mono": require("../assets/fonts/SpaceMono-Regular.ttf")
        });
    }

    private static handleLoadingError(error: Error): void {
        Log.critical("Global", error);
    }

    private defaultErrorHandler: ErrorHandlerCallback;

    public constructor(props: AppProps) {
        super(props);

        SplashScreen.preventAutoHide();

        this.state = {
            db: this.props.db || null,
            isLoadingComplete: false
        };
    }

    public componentWillMount() {
        // start services?
    }

    /**
     * Render the AppLoading screen if loading, else render the AppNavigator.
     * Passing the AppDatabase thru the AppNavigator via screenProps suggested by Miika.
     * Using SplashScreen to hide awkward loading screens suggested by Richard.
     */
    public render(): ReactNode {
        if ((!this.state.isLoadingComplete && !this.props.skipLoadingScreen) || !this.state.db) {
            return (
                <AppLoading
                    startAsync={App.loadResources.bind(this)}
                    onError={App.handleLoadingError.bind(this)}
                    onFinish={this.handleFinishLoading.bind(this)}
                />
            );
        } else {
            return (
                <View style={styles.container}>
                    {Platform.OS === "ios" && <StatusBar barStyle="default"/>}
                    <AppContainer screenProps={{ db: this.state.db }}/>
                </View>
            );
        }
    }

    private handleFinishLoading(): void {

        // intercept global errors
        this.defaultErrorHandler = ErrorUtils.getGlobalHandler();
        ErrorUtils.setGlobalHandler(this.onGlobalError.bind(this));

        // initialize database
        AppDatabase.init().then((db) => {
            // loading is complete, render the main screen
            this.setState({ db, isLoadingComplete: true });
        });
    }

    private onGlobalError(error: Error, isFatal: boolean): void {
        if (isFatal) {
            Log.critical("Global", error);
        } else {
            Log.error("Global", error);
        }
        this.defaultErrorHandler(error, isFatal);
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1
    }
});
