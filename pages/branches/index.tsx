'use client';

import DashboardLayout from '../../components/Layout';
import { httpClient } from "../../utils/HttpClient";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../utils/MyContext";
import CardContainer from '../../components/card_container/CardContainer';
import { useDebounce } from 'use-debounce'
import {
    Box,
    Container,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    InputLabel,
    MenuItem,
    DialogActions,
    TextField,
    FormControl,
    Select
} from '@mui/material';
import { ICard } from '../../components/card_container/Card';
import { States } from '../../utils/StatesData';

export default function Dashboard() {
    const { userData } = useAuth();
    // const [profileData, setProfileData] = useState(null);

    const [cards, setCards] = useState([]);
    const [valueSearch, setValueSearch] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [branchData, setBranchData] = useState({
        PublicName: "",
        Email: "",
        Address: "",
        CityName: "",
        ZipCode: "",
        PhoneNumber: "",
        StateId: ""
    });

    function CleanBranchData() {
        return setBranchData({
            PublicName: "",
            Email: "",
            Address: "",
            CityName: "",
            ZipCode: "",
            PhoneNumber: "",
            StateId: ""
        });
    }

    async function GetBranchesAPI() {
        try {
            setLoading(true);
            const UserId = userData?.UserId;
            if (!UserId) return;

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

            return;
        } catch (error: any) {
            try {
                const { message } = JSON.parse(error.message);
                toast.error(message);
            } catch {
                toast.error("Ocurrió un error");
            }
            HandleLoading(Milliseconds);
            return;
        }
    }

    const [debouncedValueSearch] = useDebounce(valueSearch, 500); // Debounce the search value with a delay of 500ms

    const [loading, setLoading] = useState(false);

    function HandleLoading(time: number) {
        setTimeout(() => {
            setLoading(false);
        }, time);
        return;
    }

    async function AddBranchAPI(BranchValues: ICard) {
        try {
            const UserId = userData?.UserId;
            if (!UserId) {
                toast.error("Usuario no autenticado");
                return;
            }

            const Branch = await httpClient(`/api/v1/sp/principals/:PrinicipalId/branches`, {
                method: 'POST',
                pathParams: { PrinicipalId: UserId },
                body: {
                    PublicName: BranchValues.PublicName,
                    Email: BranchValues.Email,
                    Address: BranchValues.Address,
                    CityName: BranchValues.CityName,
                    ZipCode: BranchValues.ZipCode,
                    PhoneNumber: BranchValues.PhoneNumber,
                    StateId: BranchValues.StateId
                }
            });


            if (!Branch.ok) {
                const Data: any = await Branch.json();
                if (Data.code === 402) {
                    setOpenDialog(false);
                    CleanBranchData();
                } else {
                    toast.error(Data.message);
                }

            } else {
                toast.success("Sucursal creada exitosamente");
                setOpenDialog(false);
                CleanBranchData();
                // Refresh the branches list after successful creation
                setValueSearch(""); // Reset search to fetch all branches
                await GetBranchesAPI();
            }

        } catch (error) {
            console.error("Error creating branch:", error);
            toast.error("Ocurrió un error al crear la sucursal");
        }
    }

    const Milliseconds = 500;

    useEffect(() => {
        (async () => {
            await GetBranchesAPI();
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

                    <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                        Crear Sucursal
                    </Button>

                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Crear Sucursal</DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    autoFocus
                                    margin="dense"
                                    label="Nombre"
                                    type="text"
                                    fullWidth
                                    value={branchData.PublicName || ""}
                                    onChange={(e) => setBranchData({ ...branchData, PublicName: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    label="Email"
                                    type="email"
                                    fullWidth
                                    value={branchData.Email || ""}
                                    onChange={(e) => setBranchData({ ...branchData, Email: e.target.value })}
                                />
                            </Box>
                            <br />

                            <FormControl fullWidth>
                                <InputLabel id="state-select-label">Selecciona un estado</InputLabel>
                                <Select
                                    labelId="state-select-label"
                                    id="state-select"
                                    value={branchData.StateId || ""}
                                    label="Selecciona un estado"
                                    onChange={(e) => setBranchData({ ...branchData, StateId: e.target.value })}
                                >
                                    <MenuItem value="">
                                        <em>Ninguno / Limpiar selección</em>
                                    </MenuItem>
                                    {States.map((state) => (
                                        <MenuItem key={state.StateId} value={state.StateId}>
                                            {state.Name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <br />

                            <TextField
                                margin="dense"
                                label="Ciudad"
                                type="text"
                                fullWidth
                                value={branchData.CityName || ""}
                                onChange={(e) => setBranchData({ ...branchData, CityName: e.target.value })}
                            />

                            <TextField
                                margin="dense"
                                label="Dirección"
                                type="text"
                                fullWidth
                                value={branchData.Address || ""}
                                onChange={(e) => setBranchData({ ...branchData, Address: e.target.value })}
                            />
                            <br />

                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                                <TextField
                                    margin="dense"
                                    label="Código Postal"
                                    type="number"
                                    fullWidth
                                    value={branchData.ZipCode || ""}
                                    onChange={(e) => setBranchData({ ...branchData, ZipCode: e.target.value })}
                                />
                                <TextField
                                    margin="dense"
                                    label="Teléfono"
                                    type="number"
                                    fullWidth
                                    value={branchData.PhoneNumber || ""}
                                    onChange={(e) => setBranchData({ ...branchData, PhoneNumber: e.target.value })}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)} color="primary">
                                Cancelar
                            </Button>
                            <Button onClick={async () => {
                                await AddBranchAPI(branchData as ICard);
                            }} color="primary">
                                Crear
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
                <CardContainer cardsData={cards} onValue={SearchText} onLoading={loading} />
            </Container>
        </DashboardLayout>
    );
}