/**
 * @module screens
 */

import React, { ReactNode } from "react";
import { SectionList, StyleSheet, View } from "react-native";
import { NavigationScreenProps } from "react-navigation";

import { HeaderIconButton, ScheduleListHeader, ScheduleListItem } from "../../components";
import { TextInputModal } from "../../components/TextInputModal";
import { Schedule } from "../../models";
import { ScheduleService } from "../../services";
import * as Log from "../../utils/Log";
import { HeaderButtonRight } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";
import { Watcher } from "../../utils/watcher";

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
    private watcher: Watcher<Schedule[]> = this.getService(ScheduleService).watchAll();

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
        for (const schedule of schedules) {
            if (this.state.schedules.has(schedule.id)) {
                this.state.schedules.get(schedule.id).schedule = schedule;
            } else {
                this.state.schedules.set(schedule.id, {
                    schedule
                });
            }
        }
        this.forceUpdate();
    }

    public onScheduleItemToggled(schedule: Schedule, isEnabled: boolean): void {
        this.getService(ScheduleService).setIsEnabled(schedule.id, isEnabled)
            .then(() => {
                for (const item of this.state.schedules.values()) {
                    if (item.schedule.id === schedule.id) {
                        item.listItemRef.forceEnabled(isEnabled);
                    } else {
                        item.listItemRef.forceEnabled(false);
                    }
                }
            });
    }

    public onScheduleItemPressed(schedule: Schedule): void {
        this.present("EditSchedule", {
            schedule,
            title: schedule.name
        });
    }

    public renderContent(): ReactNode {
        return (
            <View>
                <TextInputModal
                    isVisible={this.state.isCreateModalVisible}
                    maxLength={Schedule.NAME_MAX_LENGTH}
                    title="Create schedule"
                    text="Type a name for the new schedule:"
                    onCancelled={this.onModalCancelled.bind(this)}
                    onCompleted={this.onModalCompleted.bind(this)} />
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
                        )
                    }
                    renderSectionHeader={({ section }) => <ScheduleListHeader title={section.title}/>}
                    sections={[{ data: Array.from(this.state.schedules.values()), title: "Schedules" }]}
                />
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
            let schedule: Schedule;
            this.getService(ScheduleService).create(text)
                .then((newSchedule) => {
                    schedule = newSchedule;
                    this.onScheduleItemToggled(schedule, true);
                    this.onScheduleItemPressed(schedule);
                });
        });
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row"
    }
});
