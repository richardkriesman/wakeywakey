/**
 * @module screens
 */

/**schedule options lists Chelsea Greer
*/

import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { DestructiveButton } from "../../components/DestructiveButton";
import { ListHeader } from "../../components/list/ListHeader";
import { ListItem } from "../../components/list/ListItem";
import { ConfirmationModal } from "../../components/modal/ConfirmationModal";
import { Colors } from "../../constants/Colors";
import { Schedule } from "../../models/Schedule";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";
import {SelectPicker} from "../../components/SelectPicker";

export interface OptionsListScreenState {
    isDeleteModalVisible: boolean;
}

@BottomTabBarIcon("ios-cog")
@Title("Options")
export class OptionsListScreen extends UIScreen<{}, OptionsListScreenState> {

    private readonly schedule: Schedule;
    private colorPicker: SelectPicker;
    private audioPicker: SelectPicker;
    private snoozePicker: SelectPicker;
    private clockPicker: SelectPicker;

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

                <ListItem leftIcon={schemeIcon} title="Color Scheme" rightIcon={forwardIcon}
                          onPress={this.onColorPickerPress.bind(this)}/>
                          <SelectPicker ref={(ref) => this.colorPicker = ref} title={"ColorScheme"} values={["Red", "Orange", "Yellow", "Green", "Blue", "Purple"]}/>

                <ListItem leftIcon={audioIcon} title="Audio" rightIcon={forwardIcon}
                            onPress={this.onAudioPickerPress.bind(this)}/>
                          <SelectPicker ref={(ref) => this.audioPicker = ref} title={"Audio"} values={["MusicBox", "Birds", "PagerBeeps", "Computer", "Loud Alarm", "Normal Alarm"]}/>

                <ListItem leftIcon={snoozeIcon} title="Snooze" rightIcon={forwardIcon}
                     onPress={this.onSnoozePickerPress.bind(this)}/>
                        <SelectPicker ref={(ref) => this.snoozePicker = ref} title={"Snooze"} values={["5 min", "10 min", "15 min", "20 min", "25 min", "30 min"]}/>

                <ListItem leftIcon={clockIcon} title="Clock Style" rightIcon={forwardIcon}
                             onPress={this.onClockPickerPress.bind(this)}/>
                        <SelectPicker ref={(ref) => this.clockPicker = ref} title={"Clock"} values={["Analog", "Digital"]}/>


                <View style={styles.footer}>
                    <DestructiveButton
                        onPress={this.onDeleteButtonPress.bind(this)}
                        title="Delete schedule" />
                </View>
            </View>
        );
    }

    private onColorPickerPress(): void{
        this.colorPicker.present();
    }
    private onAudioPickerPress(): void{
        this.audioPicker.present();
    }
    private onSnoozePickerPress(): void{
        this.snoozePicker.present();
    }
    private onClockPickerPress(): void{
        this.clockPicker.present();
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
const schemeIcon = {name: "color-lens", type: "ionicons" };
const audioIcon = {name: "headset", type: "ionicons"};
const snoozeIcon = {name: "snooze", type: "ionicons"};
const clockIcon = {name: "access-time", type: "ionicons"};

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
