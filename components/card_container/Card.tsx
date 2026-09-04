import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteButton from '../DeleteButton';
import TextField from '@mui/material/TextField';
import { useState, useRef, useContext } from 'react';

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
}

export default function CardComponent({ properties }: { properties: ICard }) {
    return (
        <Card sx={{ minWidth: 275, marginBottom: 2 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={`https://ui-avatars.com/api/?name=${properties.PublicName}&background=random&size=128`}
                    alt={properties.PublicName}
                />
                <CardContent>
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
        </Card>
    )
}