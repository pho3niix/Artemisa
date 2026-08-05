'use client';

import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';
import type { } from '@mui/x-data-grid-pro/themeAugmentation';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../../components/dashboard/AppNavbar';
import Header from '../../components/dashboard/Header';
import MainGrid from '../../components/dashboard/MainGrid';
import SideMenu from '../../components/dashboard/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';

import { chartsCustomizations } from '../../components/themes/charts';
import { dataGridCustomizations } from '../../components/themes/dataGrid';
import { datePickersCustomizations } from '../../components/themes/datePickers';
import { treeViewCustomizations } from '../../components/themes/treeView';

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

// import AppTheme from "../../shared-theme/AppTheme";
import { CssBaseline } from "@mui/material";
import { ProtectedRoute } from "../../utils/ProtectedRoute";
import { httpClient } from "../../utils/HttpClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify"
import { useAuth } from "../../utils/MyContext";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
    const { userData } = useAuth();
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const userId = userData?.UserId
                const response = await httpClient(`/api/v1/sp/users/:id/profile`, {
                    method: 'GET',
                    pathParams: {
                        id: userId
                    }
                });

                const Data = await response.json();

                if (!response.ok) {
                    throw new Error(JSON.stringify(Data))
                } else {
                    setProfileData(Data.results)
                    return Data;
                }

            } catch (error) {
                try {
                    const { message, statusCode, errors } = JSON.parse(error.message);
                    console.log("Error", message, statusCode, errors);
                    toast.error(message);
                } catch {
                    toast.error("Ocurrió un error");
                }
            }
        })()
    }, [userData?.UserId])

    return (
        <ProtectedRoute>
            <AppTheme {...props} themeComponents={xThemeComponents}>
                <CssBaseline enableColorScheme />
                <Box sx={{ display: 'flex' }}>
                    <SideMenu />
                    <AppNavbar />
                    {/* Main content */}
                    <Box
                        component="main"
                        sx={(theme) => ({
                            flexGrow: 1,
                            backgroundColor: theme.vars
                                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                                : alpha(theme.palette.background.default, 1),
                            overflow: 'auto',
                        })}
                    >
                        <Stack
                            spacing={2}
                            sx={{
                                alignItems: 'center',
                                mx: 3,
                                pb: 5,
                                mt: { xs: 8, md: 0 },
                            }}
                        >
                            <Header />
                            <MainGrid />
                        </Stack>
                    </Box>
                </Box>
            </AppTheme>
        </ProtectedRoute>
    );
}