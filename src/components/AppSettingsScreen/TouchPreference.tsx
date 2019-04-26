import { ListItemProps } from "react-native-elements";
import { PreferenceItem, PreferenceItemProps } from "./PreferenceItem";

export interface TouchPreferenceProps extends PreferenceItemProps<any> {
    onPress(): void;
}

export class TouchPreference extends PreferenceItem<TouchPreferenceProps> {
    protected extraProps(): Partial<ListItemProps> {
        return {};
    }
}
