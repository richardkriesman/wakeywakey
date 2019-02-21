import {AppLoading, Asset, Font} from "expo";
import React, {ReactNode} from "react";
import {Platform, StatusBar, StyleSheet, View} from "react-native";
import {Fonts, Icons} from "./constants/Assets";
import AppNavigator from "./navigation/AppNavigator";

export interface AppScreenProps {
    skipLoadingScreen: boolean;
}

export interface AppScreenState {
    isLoadingComplete: boolean;
}

/**
 * The root component of the app.
 */
export class App extends React.Component<AppScreenProps, AppScreenState> {

    public constructor(props: AppScreenProps) {
        super(props);
        this.state = {
            isLoadingComplete: false,
        };
    }

    /**
     * Renders the root component of the app. This is a loading screen if the app is still loading, and the root
     * navigator if the app is already loaded.
     */
    public render(): ReactNode {
        if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
            return (
                <AppLoading
                    startAsync={this.loadResources.bind(this)}
                    onError={this.handleLoadingError.bind(this)}
                    onFinish={this.handleFinishLoading.bind(this)}
                />
            );
        } else {
            return (
                <View style={styles.container}>
                    {Platform.OS === "ios" && <StatusBar barStyle="default"/>}
                    <AppNavigator/>
                </View>
            );
        }
    }

    /**
     * Asynchronously loads all image and font assets from constants/Assets.ts
     */
    private async loadResources(): Promise<void> {
        await Promise.all([
            Asset.loadAsync(Object.keys(Icons).map((key: string) => Icons[key])),
            Font.loadAsync(Fonts),
        ]);
    }

    /**
     * Handles errors while loading.
     *
     * @param error The error that occurred
     */
    private handleLoadingError(error: Error): void {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
    }

    /**
     * Fires when loading is complete.
     */
    private handleFinishLoading(): void {
        this.setState({ isLoadingComplete: true });
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
    },
});
