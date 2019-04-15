import { NavigationParams, NavigationRoute, NavigationScreenProp } from "react-navigation";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import { AppDatabase } from "../AppDatabase";
import { MockDatabase } from "./MockDatabase";
import { TimeMachine } from "./TimeMachine";

jest.mock("../AppDatabase");

/**
 * A class containing mocks and utilities needed for running automated tests.
 */
export class TestEnvironment {

    /**
     * Creates a new environment
     */
    public static async init(): Promise<TestEnvironment> {
        const env = new TestEnvironment();

        // use jest's fake timer system instead of real js timers
        jest.useFakeTimers();

        // reset the global internal state for react-navigation
        NavigationTestUtils.resetInternalState();

        // create a database mock for db accesses
        env._db = await AppDatabase.init();

        return env;
    }

    /**
     * Store and retrieve raw model data from an in-memory "database"
     */
    public readonly data: MockDatabase = new MockDatabase();

    /**
     * Manipulate the system clock
     */
    public readonly timing: TimeMachine = new TimeMachine();

    private _db: AppDatabase;

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
            addListener: jest.fn(),
            dispatch: jest.fn(),
            getParam: (name: string) => {
                if (name === "db") {
                    return this.db;
                } else {
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
