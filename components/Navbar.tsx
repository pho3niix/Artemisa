import { useState, useRef, useContext } from 'react';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { MyContext } from '../utils/MyContext';

const Navbar = () => {
    const [open, setOpen] = useState(false);

    const { Trigger, LaunchTrigger } = useContext(MyContext);

    const Description = useRef(null)

    const Title = useRef(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function SaveNote(): void {
        fetch(`/api/notes`, {
            method: 'POST',
            body: JSON.stringify({
                Title: Title.current.value,
                Description: Description.current.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((res) => {
                res.json();
                handleClose();
                LaunchTrigger(!Trigger)
            })
            .catch(e => console.log(e))
    }

    return (
        <nav id="navbar">
            <div className="logo">
                <h1>Sticky Wall</h1>
            </div>

            <Button onClick={handleClickOpen} style={{ backgroundColor: '#44BEE5' }} variant="contained" endIcon={<AddIcon />}>
                Add
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Agregar Nota</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputRef={Title}
                    />
                    <TextField
                        margin="dense"
                        id="name"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        inputRef={Description}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={SaveNote}>Guardar</Button>
                </DialogActions>
            </Dialog>
        </nav >
    );
}

export default Navbar;