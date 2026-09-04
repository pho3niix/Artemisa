'use client';

import DashboardLayout from '../../components/Layout';
import { httpClient } from "../../utils/HttpClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../utils/MyContext";
import CardContainer from '../../components/card_container/CardContainer';
import { useDebounce } from 'use-debounce'
import { Box, Button, Container, Typography } from '@mui/material'

export default function Dashboard() {
    const { userData } = useAuth();
    // const [profileData, setProfileData] = useState(null);

    const [cards, setCards] = useState([]);
    const [valueSearch, setValueSearch] = useState("");

    const [debouncedValueSearch] = useDebounce(valueSearch, 500); // Debounce the search value with a delay of 500ms

    const [loading, setLoading] = useState(false);

    function HandleLoading(time: number) {
        setTimeout(() => {
            setLoading(false);
        }, time);
    }

    function CreateBranch() {
        // Implement the logic to create a new branch here
        console.log("Create Branch button clicked");
    }

    const Milliseconds = 500;

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const UserId = userData?.UserId;
                if (!UserId) return;

                if (debouncedValueSearch.trim() === "") {
                    setValueSearch("");
                }

                const GetBranches = await httpClient(`/api/v1/sp/principals/:PrinicipalId/branches?Search=${debouncedValueSearch}`, {
                    method: 'GET',
                    pathParams: { PrinicipalId: UserId }
                });

                const Data = await GetBranches.json();

                if (!GetBranches.ok) {
                    HandleLoading(Milliseconds);
                    throw new Error(JSON.stringify(Data));
                } else {
                    console.log("Branches Data:", Data.results);
                    setCards(Data.results);
                    if (debouncedValueSearch === "") {
                        setLoading(false); // Stop loading if no results found
                    } else {
                        HandleLoading(Milliseconds);
                    }
                }
            } catch (error: any) {
                try {
                    const { message } = JSON.parse(error.message);
                    toast.error(message);
                } catch {
                    toast.error("Ocurrió un error");
                }
                HandleLoading(Milliseconds);
            }
        })()
    }, [debouncedValueSearch, userData?.UserId]);

    const SearchText = (text: string) => {
        setValueSearch(text);
    }

    return (
        <DashboardLayout>
            <Container maxWidth={false}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        gap: 4,
                    }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Sucursales
                    </Typography>

                    <Button variant="contained" color="primary" onClick={CreateBranch}>
                        Crear Sucursal
                    </Button>
                </Box>
                <CardContainer cardsData={cards} onValue={SearchText} onLoading={loading} />
            </Container>
        </DashboardLayout>
    );
}