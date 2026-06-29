import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { IList } from '../pages/api/notes/queries';
import DeleteButton from './DeleteButton';
import TextField from '@mui/material/TextField';
import { useState, useRef, useContext } from 'react';
import { MyContext } from '../utils/MyContext';

const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

interface IChildren {
    children: IList;
}

export default function Note({ children }: IChildren) {

    const [EditForm, SetEditForm] = useState(false);
    const { Trigger, LaunchTrigger } = useContext(MyContext);

    const HandleEdit = () => SetEditForm(!EditForm);

    const Description = useRef(null);

    function EditComponents(text: string) {
        if (EditForm) {
            return (
                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    fullWidth
                    variant="standard"
                    defaultValue={text}
                    inputRef={Description}
                />
            )
        } else {
            return (
                <Typography style={{ color: '#404040' }} id="description" variant="overline">
                    {text}
                </Typography>
            )
        }
    }

    function UpdateNote(NoteId: IList['NoteId']): void {
        fetch(`/api/notes?NoteId=${NoteId}`, {
            method: 'PUT',
            body: JSON.stringify({
                Description: Description.current.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => {
                res.json()
                HandleEdit();
                LaunchTrigger(!Trigger)
            })
            .catch(e => console.log(e))
    }

    function SaveComponents() {
        if (EditForm) {
            return (<Button onClick={e => UpdateNote(children.NoteId)} id="edit" variant='contained' style={{ backgroundColor: 'white' }} size="small"><CheckCircleOutlineIcon /></Button>)
        } else {
            return (<Button onClick={HandleEdit} id="edit" variant='contained' style={{ backgroundColor: 'white' }} size="small"><BorderColorIcon /></Button>)
        }
    }

    return (
        <Card id="card" style={{ backgroundColor: '#cdf6d7' }} color='primary' sx={{ width: 270 }}>

            <CardActions id="card-top">
                <Typography sx={{ fontSize: 18 }} color="text.secondary">
                    {children.Title}
                </Typography>
                <DeleteButton>
                    {children}
                </DeleteButton>
            </CardActions>

            <CardContent>
                {EditComponents(children.Description)}
            </CardContent>

            <CardActions id="card-actions">
                {EditForm ? <Button onClick={HandleEdit} id="cancel" variant='contained' style={{ backgroundColor: '#ff7a81' }} size="small"><HighlightOffIcon /></Button> : ''}
                {SaveComponents()}
            </CardActions>
        </Card>
    );
}