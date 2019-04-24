import React, { ReactNode } from "react";
import { DatePickerIOS, Platform, TimePickerAndroid, TimePickerAndroidOpenReturn, View } from "react-native";
import { Button } from "react-native-elements";
import { Time } from "../utils/Time";
import { Modal } from "./modal/Modal";

export interface TimePickerState {
    isVisible: boolean;
    maxTime?: Time;
    minTime?: Time;
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
     * @param minTime Minimum time value allowed
     * @param maxTime Maximum time value allowed
     *
     * @return A Promise that resolves when the {@link TimePicker} is closed with the {@link Time} or
     *         undefined` if the TimePicker was cancelled.
     */
    public present(time: Time, minTime: Time = Time.createFromTotalSeconds(0),
                   maxTime: Time = Time.createFromTotalSeconds(86399)): Promise<Time|undefined> {
        return new Promise((resolve, reject) => {
            if (Platform.OS === "ios") { // iOS
                this.setState({
                    isVisible: true,
                    maxTime,
                    minTime,
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
                            const newTime: Time = Time.createFromDisplayTime(result.hour, result.minute);
                            if (newTime.isInRange(maxTime, minTime)) { // time is in valid range
                                resolve(newTime); // return result in seconds
                            } else { // time is not in valid range - we can't prevent closing, so cancel the dialog
                                resolve(undefined);
                            }
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
        if (this.state.time.isInRange(this.state.maxTime, this.state.minTime)) { // valid time range
            if (this.state.onIOSCompleted) {
                this.state.onIOSCompleted(this.state.time);
            }
        } else { // invalid time range, cancel
            this.onIOSCancelled();
        }
    }

    private onIOSDateChange(date: Date): void {
        this.setState({
            time: Time.createFromDisplayTime(date.getHours(), date.getMinutes(), date.getSeconds())
        });
    }

}
