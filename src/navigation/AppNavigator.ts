/**
 * @module navigation
 */

import { createAppContainer } from "react-navigation";

import MainStackNavigator from "./MainStackNavigator";

/**
 * Default app container. Connects the MainStackNavigator.
 * @author Shawn Lutch, Miika Raina
 */
export default createAppContainer(MainStackNavigator);
