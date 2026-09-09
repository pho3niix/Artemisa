import * as React from 'react';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useAuth } from '../../utils/MyContext';
import { httpClient } from '../../utils/HttpClient';
import { toast } from 'react-toastify';

export interface ICard {
    InstitutionId?: string;
    PublicName?: string;
    Email?: string;
    Address?: string;
    CityName?: string;
    ZipCode?: string;
    PhoneNumber?: string;
    State?: {
        StateId?: string;
        Name?: string;
        Code?: string;
    };
    StateId?: string;
}

interface CardComponentProps {
    properties: ICard;
    onDelete?: (institutionId: string) => void;
}

export default function CardComponent({ properties, onDelete }: CardComponentProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { userData } = useAuth();
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event?: React.MouseEvent) => {
        if (event) event.stopPropagation();
        setAnchorEl(null);
    };

    async function handleEdit(event: React.MouseEvent) {
        event.stopPropagation();
        handleMenuClose();
        // Lógica para editar
    };

    const handleDelete = async (event: React.MouseEvent) => {
        event.stopPropagation();
        handleMenuClose();

        try {
            const UserId = userData?.UserId;

            if (!UserId) {
                console.error('UserId is not available');
                return;
            }

            const response = await httpClient(`/api/v1/sp/principals/:PrinicipalId/branches/${properties.InstitutionId}`, {
                method: 'DELETE',
                pathParams: {
                    PrinicipalId: UserId
                }
            });
            
            const responseText = await response.text();
            let Data: { message?: string } = {};

            if (responseText) {
                try {
                    Data = JSON.parse(responseText);
                } catch (parseError) {
                    console.error('Invalid delete branch response:', parseError);
                }
            }

            if (!response.ok) {
                console.error('Error deleting branch:', Data);
                toast.error(Data.message || "Error al eliminar la sucursal");
            } else {
                if (properties.InstitutionId) {
                    onDelete?.(properties.InstitutionId);
                }
                toast.success(Data.message || "Sucursal eliminada exitosamente");
            }

        } catch (error) {
            console.error('Error al eliminar la tarjeta:', error);
        }
    };

    function handleCardClick() {
        console.log('Card clicked')
    }

    return (
        <Card sx={{ minWidth: 275, marginBottom: 2, position: 'relative' }}>
            {/* 1. Área clickeable principal */}
            <CardActionArea onClick={handleCardClick}>
                <CardMedia
                    component="img"
                    height="140"
                    image={`https://ui-avatars.com/api/?name=${properties.PublicName}&background=random&size=128`}
                    alt={properties.PublicName}
                />

                <CardContent sx={{ pb: 5 }}>
                    <Typography gutterBottom variant="h5" component="div">
                        {properties.PublicName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Address: {properties.Address}, {properties.CityName}, {properties.State?.Name}, {properties.ZipCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Phone: {properties.PhoneNumber}
                    </Typography>
                </CardContent>
            </CardActionArea>

            {/* 2. Botón fuera del CardActionArea (evita anidación de buttons) */}
            <Box sx={{ position: 'absolute', bottom: 8, right: 8, zIndex: 2 }}>
                <IconButton
                    aria-label="opciones"
                    aria-controls={open ? 'card-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleMenuOpen}
                    size="small"
                >
                    <MoreVertIcon />
                </IconButton>
            </Box>

            {/* 3. Menú de opciones */}
            <Menu
                id="card-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleMenuClose()}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleEdit}>
                    <ListItemIcon><BorderColorIcon fontSize="small" color="primary" /></ListItemIcon>
                    <ListItemText>Editar</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon><HighlightOffIcon fontSize="small" color="error" /></ListItemIcon>
                    <ListItemText color="error">Eliminar</ListItemText>
                </MenuItem>
            </Menu>
        </Card>
    );
}