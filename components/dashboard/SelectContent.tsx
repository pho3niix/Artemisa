import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { SelectChangeEvent, selectClasses } from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import SmartphoneRoundedIcon from '@mui/icons-material/SmartphoneRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import { useEffect, useState } from 'react';
import { useAuth } from '../../utils/MyContext';
import { httpClient } from '../../utils/HttpClient';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectContent() {
  const [company, setCompany] = useState('');
  const { userData } = useAuth();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    (async () => {
      try {

        const response = await httpClient('/api/v1/sp/principals/:PrinicipalId/branches', {
          method: 'GET',
          pathParams: {
            PrinicipalId: userData?.UserId
          }
        });

        const Data = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(Data))
        } else {
          setBranches(Data.results)
          return Data;
        }

      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    })();
  }, [userData?.UserId]);

  const handleChange = (event: SelectChangeEvent) => {
    setCompany(event.target.value as string);
  };
  
  return (
    <Select
      labelId="company-select"
      id="company-simple-select"
      value={company}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select company' }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 215,
        '&.MuiList-root': {
          p: '8px',
        },
        [`& .${selectClasses.select}`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
    >
      <ListSubheader sx={{ pt: 0 }}>Estancias</ListSubheader>
      {branches.map((branch: any, index: number) => (
        <MenuItem key={branch.InstitutionId} value={index == 0 ? '' : branch.InstitutionId}>
          <ListItemAvatar>
            <Avatar alt={branch.PublicName}>
              <DevicesRoundedIcon sx={{ fontSize: '1rem' }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={branch.PublicName} secondary={branch.Address} />
        </MenuItem>
      ))}
      <Divider sx={{ mx: -1 }} />
      <MenuItem value={40}>
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Add product" secondary="Web app" />
      </MenuItem>
    </Select>
  );
}