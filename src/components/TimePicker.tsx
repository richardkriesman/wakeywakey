import React, { ReactNode } from "react";
import { DatePickerIOS, Platform, TimePickerAndroid, TimePickerAndroidOpenReturn, View } from "react-native";
import { Modal } from "./modal/Modal";
import { Time } from "../utils/Time";
import { Button } from "react-native-elements";

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
            time: new Time()
        };
    }

    public render(): ReactNode {
        if (Platform.OS === "ios") { // iOS, render modal

            // convert time to current date for display
            const date = new Date();
            date.setHours(this.state.time.hour);
            date.setMinutes(this.state.time.minute);
            date.setSeconds(this.state.time.second);

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
                        date={date}
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
                        resolve(undefined);
                    },
                    onIOSCompleted: (newTime: Time) => {
                        resolve(newTime);
                    },
                    time: this.state.time
                });
            } else { // android, use native time picker
                TimePickerAndroid.open({
                    hour: this.state.time.hour,
                    is24Hour: false, // TODO: read this from system locale
                    minute: this.state.time.minute
                })
                    .then((result: TimePickerAndroidOpenReturn) => { // time picker was shown and closed
                        if (result.action === TimePickerAndroid.timeSetAction) { // time picker was completed
                            const newTime = new Time();
                            newTime.hour = result.hour;
                            newTime.minute = result.minute;
                            newTime.second = 0;
                            resolve(newTime); // return result in seconds
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
        const time = new Time();
        time.hour = date.getHours();
        time.minute = date.getMinutes();
        time.second = date.getSeconds();
        this.setState({ time });
    }

}