import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
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
