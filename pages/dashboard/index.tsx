'use client';

import MainGrid from '../../components/dashboard/MainGrid';
import DashboardLayout from '../../components/Layout';
import { httpClient } from "../../utils/HttpClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../utils/MyContext";

export default function Dashboard() {
    const { profileData } = useAuth();

    return (
        <DashboardLayout>
            {/* Solo pasas el contenido propio de la vista de inicio */}
            {/* <MainGrid /> */}
            <p>Bienvenido, {profileData?.FullName || 'Usuario'}!</p>
        </DashboardLayout>
    );
}