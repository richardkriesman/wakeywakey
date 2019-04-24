import React, { ReactNode } from "react";
import { DatePickerIOS, Platform, TimePickerAndroid, TimePickerAndroidOpenReturn, View } from "react-native";
import { Button } from "react-native-elements";
import { Time } from "../utils/Time";
import { Modal } from "./modal/Modal";

export interface TimePickerState {
    isVisible: boolean;
    onIOSCancelled?: () => void;
    onIOSCompleted?: (time: Time) => void;
    time: Time;
}

export class TimePicker extends React.Component<{}, TimePickerState> {

    public constructor(props: any) {
        super(props);
        this.state = {
            isVisible: false,
            time: Time.createFromDisplayTime(0, 0, 0)
        };
    }

    public render(): ReactNode {
        if (Platform.OS === "ios") { // iOS, render modal

            // convert time to current date for display
            const currentDate = new Date();
            currentDate.setHours(this.state.time.hour);
            currentDate.setMinutes(this.state.time.minute);
            currentDate.setSeconds(this.state.time.second);

            // render modal
            return (
                <Modal
                    buttons={[
                        <Button
                            key={0}
                            onPress={this.onIOSCancelled.bind(this)}
                            title="Cancel"
                            type="clear" />,
                        <Button
                            key={1}
                            onPress={this.onIOSCompleted.bind(this)}
                            title="OK"
                            type="clear" />
                    ]}
                    isVisible={this.state.isVisible}
                    title="Select a time">
                    <DatePickerIOS
                        mode="time"
                        date={currentDate}
                        onDateChange={this.onIOSDateChange.bind(this)} />
                </Modal>
            );
        } else { // android, don't render anything - this is handled by the native time picker
            return <View />;
        }
    }

    /**
     * Presents the {@link TimePicker} to the user.
     *
     * On Android, this will be displayed as the system time picker. On iOS, this will be displayed as a
     * modal in the view hierarchy with the iOS "spinner" design.
     *
     * @param time Time of day
     *
     * @return A Promise that resolves when the {@link TimePicker} is closed with the {@link Time} or
     *         undefined` if the TimePicker was cancelled.
     */
    public present(time: Time): Promise<Time|undefined> {
        return new Promise((resolve, reject) => {
            if (Platform.OS === "ios") { // iOS
                this.setState({
                    isVisible: true,
                    onIOSCancelled: () => {
                        this.setState({
                            isVisible: false
                        }, () => {
                            resolve(undefined);
                        });
                    },
                    onIOSCompleted: (newTime: Time) => {
                        this.setState({
                            isVisible: false
                        }, () => {
                            resolve(newTime);
                        });
                    },
                    time
                });
            } else { // android, use native time picker
                TimePickerAndroid.open({
                    hour: this.state.time.hour,
                    is24Hour: false, // TODO: read this from system locale
                    minute: this.state.time.minute
                })
                    .then((result: TimePickerAndroidOpenReturn) => { // time picker was shown and closed
                        if (result.action === TimePickerAndroid.timeSetAction) { // time picker was completed
                            resolve(Time.createFromDisplayTime(result.hour, result.minute)); // return result in seconds
                        } else {
                            resolve(undefined);
                        }
                    })
                    .catch(reject); // error occurred displaying time picker
            }
        });
    }

    private onIOSCancelled(): void {
        if (this.state.onIOSCancelled) {
            this.state.onIOSCancelled();
        }
    }

    private onIOSCompleted(): void {
        if (this.state.onIOSCompleted) {
            this.state.onIOSCompleted(this.state.time);
        }
    }

    private onIOSDateChange(date: Date): void {
        this.setState({
            time: Time.createFromDisplayTime(date.getHours(), date.getMinutes(), date.getSeconds())
        });
    }

}
