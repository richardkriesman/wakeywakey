/**
 * @module utils
 */

import React, { ReactNode } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationEvents, NavigationParams, NavigationScreenProps, StackActions } from "react-navigation";
import { AppDatabase } from "../AppDatabase";
import * as Log from "../Log";
import { Service } from "../Service";

type UIScreenUpdateStateCallback = () => void;

export abstract class UIScreen<P = {}, S = {}> extends React.Component<P & NavigationScreenProps, S> {

    // noinspection UnterminatedStatementJS - keeps WebStorm from giving a suggestion that conflicts with TSLint
    public static navigationOptions = ({navigation}: NavigationScreenProps) => ({
        title: navigation.getParam("title", "Untitled")
    })

    private db?: AppDatabase;

    protected constructor(props: P & NavigationScreenProps) {
        super(props);

        // extract the database from the navigation props
        this.db = this.props.screenProps.db;

        if (!this.db) {
            // database has not yet been opened, initialize it
            if (AppDatabase.initCount > 0) {
                Log.warning("UIScreen",
                    `Database was not passed to route ${this.props.navigation.state.routeName}! ` +
                    `Did you use UIScreen.present()?`);
            }

            AppDatabase.init().then((db) => {
                this.db = db;
            });
        }

        // add this screen to its own navigation params - this is nasty but it's needed for the decorators
        this.props.navigation.setParams({
            screen: this
        });
    }

    /**
     * Dismisses this {@link Screen}, revealing the screen below it.
     */
    public dismiss(): void {
        this.props.navigation.dispatch(StackActions.pop({n: 1}));
    }

    /**
     * Gets a {@link Service}. Service instances persist for the life of the {@link AppDatabase}.
     *
     * @param service The {@link Service} class to retrieve.
     */
    public getService<T extends Service>(service: new(db: AppDatabase) => T): T {
        return this.db ? this.db.getService(service) : null;
    }

    /**
     * Presents another {@link Screen} on top of this Screen. This Screen will be suspended until all Screens above it
     * are dismissed.
     *
     * @param routeName The name of the screen to present.
     * @param params Additional parameters to pass through to the new Screen.
     */
    public present(routeName: string, params?: NavigationParams): void {
        this.props.navigation.dispatch(StackActions.push({
            params: {
                db: this.db,
                ...params
            },
            routeName
        }));
    }

    public render(): ReactNode {
        return (
            <SafeAreaView style={styles.container}>
                <NavigationEvents
                    onDidBlur={this.componentDidBlur.bind(this)}
                    onDidFocus={this.componentDidFocus.bind(this)}
                    onWillBlur={this.componentWillBlur.bind(this)}
                    onWillFocus={this.componentWillFocus.bind(this)}
                    navigation={this.props.navigation}/>
                {this.renderContent()}
            </SafeAreaView>
        );
    }

    protected componentDidBlur(): void {
        return;
    }

    protected componentDidFocus(): void {
        return;
    }

    protected componentWillBlur(): void {
        return;
    }

    protected componentWillFocus(): void {
        return;
    }

    /**
     * Update just a few keys in the screen's state, with an optional callback.
     * Preserves RN's state-render pipeline by calling setState underneath.
     *
     * @param newValues A new set of values to copy into the state
     * @param cb Optional callback for setState
     */
    protected updateState(newValues: Partial<S>, cb?: UIScreenUpdateStateCallback): void {
        const temp = Object.assign({}, this.state);
        const newState = Object.assign(temp, newValues);
        this.setState(newState, cb);
    }

    /**
     * Renders the screen's content within safe area bounds for iOS.
     */
    protected abstract renderContent(): ReactNode;

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
