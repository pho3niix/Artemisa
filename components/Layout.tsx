'use client';

import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { CssBaseline } from "@mui/material";
import AppNavbar from './dashboard/AppNavbar';
import Header from './dashboard/Header';
import SideMenu from './dashboard/SideMenu';
import AppTheme from './../shared-theme/AppTheme';
import { ProtectedRoute } from "../utils/ProtectedRoute";

import { chartsCustomizations } from './themes/charts';
import { dataGridCustomizations } from './themes/dataGrid';
import { datePickersCustomizations } from './themes/datePickers';
import { treeViewCustomizations } from './themes/treeView';
import DialogsProvider from './hooks/useDialogs/DialogsProvider';
import NotificationsProvider from './hooks/useNotifications/NotificationsProvider';

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <NotificationsProvider>
            <DialogsProvider>
                <ProtectedRoute>
                    <AppTheme themeComponents={xThemeComponents}>
                        <CssBaseline enableColorScheme />
                        <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
                            {/* El menú y la barra lateral ahora viven aquí de forma global */}
                            <SideMenu />
                            <AppNavbar />
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
                                    {/* Aquí se renderizará dinámicamente la página actual (Dashboard, Maestros, Grupos, etc.) */}
                                    {children}
                                </Stack>
                            </Box>
                        </Box>
                    </AppTheme>
                </ProtectedRoute>
            </DialogsProvider>
        </NotificationsProvider>
    );
}