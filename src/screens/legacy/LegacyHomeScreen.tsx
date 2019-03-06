import { WebBrowser } from "expo";
import React, {ReactNode} from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {NavigationScreenOptions} from "react-navigation";
import { MonoText } from "../../components/StyledText";

export default class HomeScreen extends React.Component {
    public static navigationOptions: NavigationScreenOptions = {
        header: null,
    };

    public render(): ReactNode {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.welcomeContainer}>
                        <Image
                            source={
                                __DEV__
                                    ? require("../../assets/images/robot-dev.png")
                                    : require("../../assets/images/robot-prod.png")
                            }
                            style={styles.welcomeImage}
                        />
                    </View>

                    <View style={styles.getStartedContainer}>
                        {this.maybeRenderDevelopmentModeWarning()}

                        <Text style={styles.getStartedText}>Get started by opening</Text>

                        <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
                            <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
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
                        <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
                    </View>
                </View>
            </View>
        );
    }

    private maybeRenderDevelopmentModeWarning(): ReactNode {
        if (__DEV__) {
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
        } else {
            return (
                <Text style={styles.developmentModeText}>
                    You are not in development mode, your app will run at full speed.
                </Text>
            );
        }
    }

    private handleLearnMorePress = () => {
        WebBrowser.openBrowserAsync("https://docs.expo.io/versions/latest/guides/development-mode");
    }

    private handleHelpPress = () => {
        WebBrowser.openBrowserAsync(
            "https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes"
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
        alignItems: "center",
        backgroundColor: "#fbfbfb",
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
