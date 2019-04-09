/**
 * @module utils
 */

import MockDate from "mockdate";
import {NavigationParams, NavigationRoute, NavigationScreenProp} from "react-navigation";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import { ReactTestInstance } from "react-test-renderer";
import {AppDatabase} from "./AppDatabase";

jest.mock("./AppDatabase");

/**
 * A class containing mocks and utilities needed for running automated tests.
 */
export class TestEnvironment {

    /**
     * Creates a new environment
     */
    public static async init(): Promise<TestEnvironment> {
        const env = new TestEnvironment();

        // reset the global internal state for react-navigation
        NavigationTestUtils.resetInternalState();

        // create a database mock for db accesses
        env._db = await AppDatabase.init();

        return env;
    }

    private _db: AppDatabase;

    /**
     * Sets the current date for the system. This will affect components that access the system clock, such as
     * `new Date()`.
     *
     * @param time Unix time in milliseconds (ms)
     */
    public set date(time: number) {
        MockDate.set(time);
    }

    /**
     * A mock for the on-device database
     */
    public get db(): AppDatabase {
        return this._db;
    }

    /**
     * A mock for the navigation property used in screens.
     */
    public get navigationProp(): NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams> {
        return {
            dispatch: jest.fn(),
            getParam: (name: string) => {
                switch (name) {
                    case "db": // UIScreen should try to retrieve an AppDatabase, give it the mock
                        return this.db;
                    default:
                        return jest.fn();
                }
            },
            navigate: jest.fn(),
            navigation: jest.fn(),
            setParams: jest.fn(),
            state: {
                params: {
                    db: this.db
                }
            }
        } as any;
    }
}

/**
 * Given a {@link ReactTestInstance} produced by `ReactTestRenderer.getInstance()`, attempts to find a component in the
 * tree with the given test ID.
 *
 * If no component exists in the tree, this will return null.
 *
 * @param node The root node of the component tree
 * @param id The test ID to search for
 */
export function findComponentWithTestId(node: ReactTestInstance, id: string): ReactTestInstance | null {
    if (node.props && node.props.testID === id) { // current node is the component we want
        return node;
    }

    // tree has children, traverse down them
    if (node.children && node.children.length > 0) {
        for (const child of node.children) {
            const element: ReactTestInstance | null = findComponentWithTestId(child as ReactTestInstance, id);
            if (element) {
                return element;
            }
        }
    }

    return null; // no element was found
}
