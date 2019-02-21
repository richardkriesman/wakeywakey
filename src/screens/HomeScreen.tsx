import {WebBrowser} from "expo";
import React, {ReactNode} from "react";
import {Platform} from "react-native";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {NavigationScreenOptions} from "react-navigation";
import {MonoText} from "../components/StyledText";
import {Icons} from "../constants/Assets";

export class HomeScreen extends React.Component {
    public static navigationOptions: NavigationScreenOptions = {
        header: null
    };

    public render(): ReactNode {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.welcomeContainer}>
                        <Image
                            source={Icons.RobotDev}
                            style={styles.welcomeImage}
                        />
                    </View>

                    <View style={styles.getStartedContainer}>
                        {this.maybeRenderDevelopmentModeWarning()}

                        <Text style={styles.getStartedText}>Get started by opening</Text>

                        <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                            <MonoText style={styles.codeHighlightText}>src/screens/HomeScreen.tsx</MonoText>
                        </View>

                        <Text style={styles.getStartedText}>
                            Change this text and your app will automatically reload.
                        </Text>
                    </View>

                    <View style={styles.helpContainer}>
                        <TouchableOpacity onPress={this.handleHelpPress} style={styles.helpLink}>
                            <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={styles.tabBarInfoContainer}>
                    <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

                    <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
                        <MonoText style={styles.codeHighlightText}>src/navigation/MainTabNavigator.tsx</MonoText>
                    </View>
                </View>
            </View>
        );
    }

    private handleHelpPress(): Promise<any> {
        return WebBrowser.openBrowserAsync(
            "https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes"
        );
    }

    private handleLearnMorePress(): Promise<any> {
        return WebBrowser.openBrowserAsync("https://docs.expo.io/versions/latest/guides/development-mode");
    }

    private maybeRenderDevelopmentModeWarning() {
        const learnMoreButton = (
            <Text onPress={this.handleLearnMorePress} style={styles.helpLinkText}>
                Learn more
            </Text>
        );

        return (
            <Text style={styles.developmentModeText}>
                Development mode is enabled, your app will be slower but you can use useful development
                tools. {learnMoreButton}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    codeHighlightContainer: {
        backgroundColor: "rgba(0,0,0,0.05)",
        borderRadius: 3,
        paddingHorizontal: 4
    },
    codeHighlightText: {
        color: "rgba(96,100,109, 0.8)"
    },
    container: {
        backgroundColor: "#fff",
        flex: 1
    },
    contentContainer: {
        paddingTop: 30
    },
    developmentModeText: {
        color: "rgba(0,0,0,0.4)",
        fontSize: 14,
        lineHeight: 19,
        marginBottom: 20,
        textAlign: "center"
    },
    getStartedContainer: {
        alignItems: "center",
        marginHorizontal: 50
    },
    getStartedText: {
        color: "rgba(96,100,109, 1)",
        fontSize: 17,
        lineHeight: 24,
        textAlign: "center"
    },
    helpContainer: {
        alignItems: "center",
        marginTop: 15
    },
    helpLink: {
        paddingVertical: 15
    },
    helpLinkText: {
        color: "#2e78b7",
        fontSize: 14
    },
    homeScreenFilename: {
        marginVertical: 7
    },
    navigationFilename: {
        marginTop: 5
    },
    tabBarInfoContainer: {
        alignItems: "center",
        backgroundColor: "#fbfbfb",
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        ...Platform.select({
            android: {
                elevation: 20
            },
            ios: {
                shadowColor: "black",
                shadowOpacity: 0.1,
                shadowRadius: 3
            }
        }),
        paddingVertical: 20
    },
    tabBarInfoText: {
        color: "rgba(96,100,109, 1)",
        fontSize: 17,
        textAlign: "center"
    },
    welcomeContainer: {
        alignItems: "center",
        marginBottom: 20,
        marginTop: 10
    },
    welcomeImage: {
        height: 80,
        marginLeft: -10,
        marginTop: 3,
        resizeMode: "contain",
        width: 100
    }
});
