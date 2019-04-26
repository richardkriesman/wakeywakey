import { NavigationParams, NavigationRoute, NavigationScreenProp, NavigationScreenProps } from "react-navigation";
import NavigationTestUtils from "react-navigation/NavigationTestUtils";
import { AppDatabase } from "../AppDatabase";
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
     * A mock for props that should be passed to every UIScreen
     */
    public get emptyUIScreenProps(): NavigationScreenProps {
        return {
            navigation: this.navigationProp,
            screenProps: { db: this.db }
        };
    }

    /**
     * A mock for the navigation property used in screens.
     */
    public get navigationProp(): NavigationScreenProp<NavigationRoute<NavigationParams>, NavigationParams> {
        const params: any = {
            db: this.db
        };
        return {
            addListener: jest.fn(),
            dispatch: jest.fn(),
            getParam: (name: string) => {
                if (params.hasOwnProperty(name)) {
                    return params[name];
                } else {
                    throw new Error(`TestEnvironment: Param ${name} was requested but is not defined`);
                }
            },
            navigate: jest.fn(),
            navigation: jest.fn(),
            setParams: (newParams: Partial<NavigationParams>): boolean => {
                for (const key of Object.keys(newParams)) {
                    params[key] = newParams[key];
                }
                return true;
            },
            state: {
                params
            }
        } as any;
    }
}
