'use client';

import { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Typography,
    CircularProgress,
    Grid
} from '@mui/material';;
import CardComponent, { ICard } from './Card';

export interface CardContainerProps {
    cardsData: ICard[];
    onValue?: (value: string) => void;
    onLoading?: boolean;
}

export default function CardContainer({ cardsData, onValue, onLoading }: CardContainerProps) {
    const [search, setSearch] = useState("");

    const onTyping = (value: string) => {
        setSearch(value);
        if (onValue) {
            onValue(value);
        }
    };

    return (
        <Container maxWidth={false} sx={{ mt: 4 }}>
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    label="Buscar..."
                    variant="outlined"
                    value={search}
                    onChange={(e) => onTyping(e.target.value)}
                    sx={{ mb: 2 }}
                />
            </Box>

            <Grid container spacing={2}>
                {onLoading ? (
                    <Grid size={12} sx={{ textAlign: 'center', py: 4 }}>
                        <CircularProgress />
                    </Grid>
                ) : cardsData.length > 0 ? (
                    cardsData.map((card, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={card.InstitutionId || index}>
                            <CardComponent properties={card} />
                        </Grid>
                    ))
                ) : (
                    <Grid size={12}>
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', my: 2 }}>
                            No se encontraron resultados.
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
}