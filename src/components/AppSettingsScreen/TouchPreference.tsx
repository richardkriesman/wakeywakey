import { ListItemProps } from "react-native-elements";
import { PreferenceItem } from "./PreferenceItem";

export class TouchPreference extends PreferenceItem<any> {
    protected extraProps(): Partial<ListItemProps> {
        return {};
    }
}
