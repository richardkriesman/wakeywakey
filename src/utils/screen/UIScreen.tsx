import React, {ReactNode} from "react";
import {SafeAreaView, StyleSheet} from "react-native";
import { NavigationParams, NavigationScreenProps, StackActions } from "react-navigation";
import { AppDatabase } from "../AppDatabase";
import { Service } from "../Service";

export abstract class UIScreen<P = {}, S = {}> extends React.Component<P & NavigationScreenProps, S> {
    public static navigationOptions = ({navigation}: NavigationScreenProps) => ({
        title: navigation.getParam("title", "Untitled")
    })

    private db?: AppDatabase;

    protected constructor(props: P & NavigationScreenProps) {
        super(props);

        // extract the database from the navigation props
        this.db = this.props.navigation.getParam("database");
        if (this.db) {
            delete this.props.navigation.state.params.database;
        } else { // database has not yet been opened, initialize it
            AppDatabase.init()
                .then((db) => {
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
        this.props.navigation.dispatch(StackActions.pop({ n: 1 }));
    }

    /**
     * Instantiates a new instance of a {@link Service}.
     *
     * @param service The {@link Service} class to retrieve.
     */
    public getService<T extends Service>(service: new(db: AppDatabase) => T): T {
        return new service(this.db);
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
                ...params
            },
            routeName
        }));
    }

    public render(): ReactNode {
        return (
            <SafeAreaView style={styles.container}>
                {this.renderContent()}
            </SafeAreaView>
        );
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
