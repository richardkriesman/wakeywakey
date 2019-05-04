// i give up. sL
/* istanbul ignore file */

import { createAppContainer } from "react-navigation";

import { AppStackNavigator } from "./AppStackNavigator";

/**
 * Default app container. Connects the MainStackNavigator.
 * @author Shawn Lutch, Miika Raina
 */
export const AppContainer = createAppContainer(AppStackNavigator);
