import React, { ReactNode } from "react";
import { Button, ButtonProps, Theme, ThemeProvider } from "react-native-elements";
import Colors from "../constants/Colors";

export class DestructiveButton extends React.Component<ButtonProps> {

    public render(): ReactNode {
        return (
            <ThemeProvider theme={theme}>
                <Button
                    raised={true}
                    {...this.props} />
            </ThemeProvider>
        );
    }

}

const theme: Theme = {
    colors: {
        primary: Colors.common.tint.destructive
    }
};
