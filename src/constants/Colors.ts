/**
 * @module constants
 */

const primaryConstructive: string = "#007aff";
const primaryDestructive: string = "#ff3b30";
const white: string = "#ffffff";

export default {
    android: {
        switch: {
            thumb: {
                true: primaryConstructive
            },
            track: {
                false: "#b2b2b2",
                true: "#69a8ff"
            }
        }
    },
    black: "#000000",
    common: {
        alert: {
            separator: "#d9d9d9"
        },
        screen: {
            background: white
        },
        tab: {
            icon: {
                default: "#cccccc",
                selected: "#2f95dc"
            }
        },
        text: {
            subheader: "#5e5e5e"
        },
        tint: {
            constructive: primaryConstructive,
            destructive: primaryDestructive
        }
    },
    ios: {
        switch: {
            track: {
                false: "#e7e7e7",
                true: primaryConstructive
            }
        }
    },
    white: "#ffffff"
};
