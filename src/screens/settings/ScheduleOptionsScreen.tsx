/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { DestructiveButton } from "../../components/DestructiveButton";
import { ListHeader } from "../../components/list/ListHeader";
import { ListItem } from "../../components/list/ListItem";
import { ConfirmationModal } from "../../components/modal/ConfirmationModal";
import Colors from "../../constants/Colors";
import { Schedule } from "../../models/Schedule";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";

export interface ScheduleOptionsScreenState {
    isDeleteModalVisible: boolean;
}

@BottomTabBarIcon("ios-cog")
@Title("Options")
export class ScheduleOptionsScreen extends UIScreen<{}, ScheduleOptionsScreenState> {

    private readonly schedule: Schedule;

    public constructor(props: NavigationScreenProps) {
        super(props);
        this.state = {
            isDeleteModalVisible: false
        };
        this.schedule = this.props.navigation.getParam("schedule");
    }

    public renderContent(): ReactNode {
        return (
            <View style={styles.viewScroller}>
                <ConfirmationModal
                    isDestructiveAction={true}
                    isVisible={this.state.isDeleteModalVisible}
                    positiveLabel="Delete"
                    negativeLabel="Cancel"
                    title="Delete this schedule?"
                    onCompleted={this.onDeleteModalCompleted.bind(this)} />

                <ListHeader title="Options" />

                <ListItem title="Color Scheme" subtitle="Summer" rightIcon={forwardIcon}/>
                <ListItem title="Audio" rightIcon={forwardIcon}/>
                <ListItem title="Snooze" rightIcon={forwardIcon}/>
                <ListItem title="Clock Style" subtitle="Digital" rightIcon={forwardIcon}/>

                <View style={styles.footer}>
                    <DestructiveButton
                        onPress={this.onDeleteButtonPress.bind(this)}
                        title="Delete schedule" />
                </View>
            </View>
        );
    }

    private onDeleteButtonPress(): void {
        this.setState({
            isDeleteModalVisible: true
        });
    }

    private onDeleteModalCompleted(shouldDelete: boolean): void {
        this.setState({
            isDeleteModalVisible: false
        }, () => {
            if (shouldDelete) {
                this.schedule.delete()
                    .then(() => {
                        this.dismiss();
                    });
            }
        });
    }

}

const forwardIcon = { name: "arrow-forward", type: "ionicons" };

const styles = StyleSheet.create({
    footer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 20
    },
    textSectionHeader: {
        color: Colors.common.text.subheader,
        fontSize: 17,
        fontWeight: "600",
        marginBottom: 10
    },
    viewScroller: {
        flex: 1
    }
});
