import React, {ReactNode} from "react";
import {SafeAreaView, StyleSheet} from "react-native";
import { NavigationParams, NavigationScreenOptions, NavigationScreenProps, StackActions } from "react-navigation";
import { AppDatabase } from "./AppDatabase";
import { Service } from "./Service";

/**
 * Removes the screen's header
 */
export function NoHeader<T>(constructor: T) {
    (constructor as any).navigationOptions.header = null;
}

export abstract class UIScreen<P = {}, S = {}> extends React.Component<P & NavigationScreenProps, S> {
    public static navigationOptions: NavigationScreenOptions = {};

    private readonly db?: AppDatabase;

    protected constructor(props: P & NavigationScreenProps) {
        super(props);

        // extract the database from the navigation props
        this.db = this.props.navigation.getParam("database", undefined);
        if (this.db) {
            delete this.props.navigation.state.params.database;
        }

    }

    public render(): ReactNode {
        return (
            <SafeAreaView style={styles.container}>
                {this.renderContent()}
            </SafeAreaView>
        );
    }

    /**
     * Instantiates a new instance of a {@link Service}.
     *
     * @param service The {@link Service} class to retrieve.
     */
    protected getService<T extends Service>(service: new(db: AppDatabase) => T): T {
        return new service(this.db);
    }

    /**
     * Presents another {@link Screen} on top of this Screen. This Screen will be suspended until all Screens above it
     * are dismissed.
     *
     * @param routeName The name of the screen to present.
     * @param params Additional parameters to pass through to the new Screen.
     */
    protected present(routeName: string, params?: NavigationParams): void {
        this.props.navigation.dispatch(StackActions.push({
            params: {
                ...params
            },
            routeName
        }));
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
