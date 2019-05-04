/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { Image, StyleSheet, ScrollView, Text } from "react-native";

import { UIScreen } from "../utils/screen";
import { NoHeader } from "../utils/screen/NavigationOptions";


export default class AboutScreen extends UIScreen<{}, {}> {

    public title:string = "Wakey Wakey"
    public authors:string = `Created by:
Chelsea Greer, Richard Kriesman,
Cody Kyrk, Shawn Lutch, Miika Raina`;
    public body:string = `Conventional alarm systems provide few alarm customization \
options and use jarring noises that may startle small children. These systems can \
be reconfigured by children, whether accidentally or intentionally, which results \
in unintended behavior. Parents and guardians have little control over options such \
as alarm type, customization, and sleep scheduling.

WakeyWakey is a child-focused, guardian-managed alarm clock app for iOS and Android. \
Guardians create weekly schedules, each with a set of daily alarms. Each alarm has a \
timing for a child to go to bed, wake up, and get out of bed. Alarms are highly customizable, \
with child-friendly avatars and sounds, color changes, and configurable snooze functionality. \
Settings are protected by a passcode to avoid unintentional changes.

WakeyWakey provides guardians the means of enforcing a more rigid – yet gentle and friendly \
– weekly sleep schedule for their children.`;

    public renderContent(): ReactNode {
        return (
            <ScrollView contentContainerStyle={styles.mainContainer}>
                <Image
                    source={require("../../assets/images/team-logo.png")}
                    style={styles.logo}
                />
                <Text style={styles.body}>{this.body}</Text>
                <Text style={styles.authors}>{this.authors}</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    authors: {
        color: "lightslategrey",
        fontSize: 12,
        margin: 15,
        textAlign: "center"
    },
    body: {
        fontSize: 16,
        padding: 10
    },
    logo: {
    },
    mainContainer: {
        alignItems: "center",
        justifyContent: "center",
    }
});
