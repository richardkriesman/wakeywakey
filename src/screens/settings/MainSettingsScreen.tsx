/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { HeaderIconButton, ScheduleListItem } from "../../components";
import { TextInputModal } from "../../components/modal";
import { Schedule } from "../../models";
import { ScheduleService } from "../../services";
import { HeaderButtonRight } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";
import { Watcher } from "../../utils/watcher";
import { EmptyView } from "../../components/EmptyView";
import { ListHeader } from "../../components/ListHeader";

/**
 * Main settings screen state. Includes schedule states.
 * @author Shawn Lutch
 */
export interface MainSettingsScreenState {
    isCreateModalVisible: boolean;
    schedules: Map<number, ScheduleListItemData>;
}

/**
 * Data associated with each list item
 * @author Richard Kriesman
 */
export interface ScheduleListItemData {
    schedule: Schedule;
    listItemRef?: ScheduleListItem;
}

/**
 * Main Settings screen.
 * @author Shawn Lutch, Miika Raina
 */
@HeaderButtonRight((screen) =>
    <View style={styles.header}>
        <HeaderIconButton
            icon="lock"
            onPress={() => screen.present("PasscodeChange")} />
        <HeaderIconButton
            icon="add"
            onPress={() => screen.setState({
                isCreateModalVisible: true
            })} />
    </View>)
export default class MainSettingsScreen extends UIScreen<{}, MainSettingsScreenState> {

    private dataSetChangedHandler: (data: Schedule[]) => void;
    private watcher: Watcher<Schedule> = this.getService(ScheduleService).watchAll();

    public constructor(props: NavigationScreenProps) {
        super(props);
        this.state = {
            isCreateModalVisible: false,
            schedules: new Map()
        };
    }

    public componentWillMount(): void {
        this.dataSetChangedHandler = this.onDataSetChanged.bind(this);
        this.watcher.on(this.dataSetChangedHandler);
    }

    public componentWillUnmount(): void {
        this.watcher.off(this.dataSetChangedHandler);
    }

    public onDataSetChanged(schedules: Schedule[]): void {

        // build a new map of schedules
        const scheduleItems: Map<number, ScheduleListItemData> = new Map();
        for (const schedule of schedules) {
            let scheduleItem: ScheduleListItemData|undefined = this.state.schedules.get(schedule.id);
            if (scheduleItem) {
                scheduleItem.schedule = schedule;
            } else {
                scheduleItem = {
                    schedule
                };
            }
            scheduleItems.set(schedule.id, scheduleItem);
        }

        // replace the existing schedule map
        this.setState({
            schedules: scheduleItems
        });
    }

    public onScheduleItemToggled(schedule: Schedule, isEnabled: boolean): void {

        // toggle the switch on all list items
        const promises: Array<Promise<void>> = [];
        for (const item of this.state.schedules.values()) {
            if (item.schedule.id === schedule.id) {
                promises.push(item.listItemRef.forceEnabled(isEnabled));
            } else {
                promises.push(item.listItemRef.forceEnabled(false));
            }
        }

        Promise.all(promises)
            .then(() => {
                this.getService(ScheduleService).setIsEnabled(schedule.id, isEnabled);
            });
    }

    public onScheduleItemPressed(schedule: Schedule): void {
        /*
         * Okay, explanation as to why `screen` is being passed in here:
         * EditSchedule is a bottom tab navigator, which isn't a UIScreen. However, it needs a UIScreen object so it can
         * call `present` when the "add alarm" button is pressed. This is a horrible hack, but I don't have a better
         * solution at this precise moment in time.
         */
        this.present("EditSchedule", {
            schedule,
            screen: this,
            title: schedule.name
        });
    }

    public renderContent(): ReactNode {

        // render main content
        let content: ReactNode;
        if (this.state.schedules.size > 0) { // schedules exist, render the list
            content = (
                <SectionList
                    keyExtractor={(item: ScheduleListItemData) => item.schedule.id.toString()}
                    renderItem={({ item }) => (
                        <ScheduleListItem
                            ref={(me: ScheduleListItem) => {
                                item.listItemRef = me;
                            }}
                            onPress={this.onScheduleItemPressed.bind(this, item.schedule)}
                            onSwitchToggled={this.onScheduleItemToggled.bind(this, item.schedule)}
                            title={item.schedule.name}
                            enabled={item.schedule.isEnabled}
                        />
                    )}
                    renderSectionHeader={({ section }) => <ListHeader title={section.title}/>}
                    sections={[{ data: Array.from(this.state.schedules.values()), title: "Schedules" }]}
                />
            );
        } else { // schedules do not exist, render empty message
            content = (
                <EmptyView
                    icon="ios-calendar"
                    title="No schedules yet"
                    subtitle="Create a schedule to set alarms" />
            );
        }

        return (
            <View style={styles.container}>
                <TextInputModal
                    isVisible={this.state.isCreateModalVisible}
                    maxLength={Schedule.NAME_MAX_LENGTH}
                    title="Create schedule"
                    text="Type a name for the new schedule:"
                    onCancelled={this.onModalCancelled.bind(this)}
                    onCompleted={this.onModalCompleted.bind(this)} />
                {content}
            </View>
        );
    }

    private onModalCancelled(): void {
        this.setState({
            isCreateModalVisible: false
        });
    }

    private onModalCompleted(text: string): void {
        this.setState({
            isCreateModalVisible: false
        }, () => {
            this.getService(ScheduleService).create(text)
                .then((schedule) => {
                    this.onScheduleItemPressed(schedule);
                });
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row"
    }
});
