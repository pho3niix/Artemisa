'use client';

import MainGrid from '../../components/dashboard/MainGrid';
import DashboardLayout from '../../components/Layout';
import { httpClient } from "../../utils/HttpClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../utils/MyContext";
import List from '../../components/crud/List'

export default function Dashboard() {
    const { userData } = useAuth();
    // const [profileData, setProfileData] = useState(null);

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const userId = userData?.UserId;
    //             if (!userId) return;

    //             const response = await httpClient(`/api/v1/sp/users/:id/profile`, {
    //                 method: 'GET',
    //                 pathParams: { id: userId }
    //             });

    //             const Data = await response.json();

    //             if (!response.ok) {
    //                 throw new Error(JSON.stringify(Data));
    //             } else {
    //                 console.log("Profile Data:", Data.results);
    //                 setProfileData(Data.results);
    //             }

    //         } catch (error: any) {
    //             try {
    //                 const { message } = JSON.parse(error.message);
    //                 toast.error(message);
    //             } catch {
    //                 toast.error("Ocurrió un error");
    //             }
    //         }
    //     })();
    // }, [userData?.UserId]);

    return (
        <DashboardLayout>
            <List />
        </DashboardLayout>
    );
}