'use client';

import AppTheme from "../../shared-theme/AppTheme";
import { CssBaseline } from "@mui/material";
import { ProtectedRoute } from "../../utils/ProtectedRoute";
import { httpClient } from "../../utils/HttpClient";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify"
import { useAuth } from "../../utils/MyContext";

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
    const { userData } = useAuth();

    useEffect(() => {
        (async () => {
            const userId = userData.UserId
            try {
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
                    return Data;
                }

            } catch (error) {
                const { message, statusCode, errors } = JSON.parse(error.message)
                console.log("Error", message, statusCode, errors)
                toast.error(message)
            }
        })()
    }, [])

    return (
        // <ProtectedRoute>
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <p>hola mundo</p>
            </AppTheme>
        // </ProtectedRoute>
    );
}