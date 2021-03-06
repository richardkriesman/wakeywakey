/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { Button } from "react-native-elements";
import { NavigationScreenProps } from "react-navigation";

import { ScheduleListItem } from "../../components";
import { EmptyView } from "../../components/EmptyView";
import { ListHeader } from "../../components/list/ListHeader";
import { TextInputModal } from "../../components/modal";
import { Schedule } from "../../models";
import { ScheduleService } from "../../services";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";
import { Watcher } from "../../utils/watcher";

/**
 * Main settings screen state. Includes schedule states.
 * @author Shawn Lutch
 */
export interface ScheduleListScreenState {
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
@Title("Schedules")
@BottomTabBarIcon("ios-calendar")
export class ScheduleListScreen extends UIScreen<{}, ScheduleListScreenState> {

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
            let scheduleItem: ScheduleListItemData | undefined = this.state.schedules.get(schedule.id);
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
         * Schedule is a bottom tab navigator, which isn't a UIScreen. However, it needs a UIScreen object so it can
         * call `present` when the "add alarm" button is pressed. This is a horrible hack, but I don't have a better
         * solution at this precise moment in time.
         */
        this.present("Schedule", {
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
                <View style={styles.viewScroller}>
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
                    <View style={styles.footer}>
                        <Button
                            raised={true}
                            title="Add schedule"
                            onPress={this.showModal.bind(this)}
                        />
                    </View>
                </View>
            );
        } else { // schedules do not exist, render empty message
            content = (
                <EmptyView
                    icon="ios-calendar"
                    title="No schedules yet"
                    subtitle="Tap here to create one!"
                    onPress={this.showModal.bind(this)}
                />
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
                    onCompleted={this.onModalCompleted.bind(this)}/>
                {content}
            </View>
        );
    }

    private showModal(): void {
        this.setState({
            isCreateModalVisible: true
        });
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
    footer: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 20
    },
    header: {
        flexDirection: "row"
    },
    viewScroller: {
        flex: 1
    }
});
