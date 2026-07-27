'use client';

import AppTheme from "../../shared-theme/AppTheme";
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
            <AppTheme {...props}>
                <CssBaseline enableColorScheme />
                <h1>Perfil</h1>

                {/* Validamos que profileData exista antes de intentar leer sus propiedades */}
                {profileData ? (
                    <p>{profileData.Name} {profileData.LastName}</p>
                ) : (
                    <p>Cargando información...</p>
                )}
            </AppTheme>
        </ProtectedRoute>
    );
}