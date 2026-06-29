import * as React from "react";
import AppTheme from "../shared-theme/AppTheme";
import { CssBaseline } from "@mui/material";


export default function Dashboard(props: { disableCustomTheme?: boolean }) {

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme>
                <p>hola mundo</p>
            </CssBaseline>
        </AppTheme>
    );
}