import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import Search from './Search';

export default function Header() {
  return (
    <Box
      component="header"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        pt: 1.5,
        px: 2, // Controla qué tan cerca de la orilla queda (pon 0 si lo quieres 100% pegado al filo)
      }}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" spacing={1}>
        <Search />
        <CustomDatePicker />
        <MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>
        <ColorModeIconDropdown />
      </Stack>
    </Box>
  );
}