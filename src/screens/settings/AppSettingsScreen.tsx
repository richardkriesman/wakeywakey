import * as React from "react";
import { EmptyView } from "../../components/EmptyView";
import { BottomTabBarIcon, Title } from "../../utils/screen/NavigationOptions";
import { UIScreen } from "../../utils/screen/UIScreen";

@Title("Preferences")
@BottomTabBarIcon("ios-cog")
export class AppSettingsScreen extends UIScreen {

    public renderContent(): React.ReactNode {
        return (
            <EmptyView
                icon="ios-cog"
                title="No preferences yet"
                subtitle="Really wanged it this time!!!"
            />
        );
    }

}
