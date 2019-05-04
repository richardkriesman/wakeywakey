/**
 * @module constants
 */

import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export const Layout = {
    isSmallDevice: width < 375,
    window: {
        height,
        width
    }
};
