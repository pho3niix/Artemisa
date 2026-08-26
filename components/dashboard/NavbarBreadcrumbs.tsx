import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

const routeNames: { [key: string]: string } = {
  inicio: 'Dashboard',
  branches: 'Estancias',
  ninos: 'Niños',
  grupos: 'Grupos',
  settings: 'Settings',
  about: 'About',
  feedback: 'Feedback',
};

export default function NavbarBreadcrumbs() {
  const router = useRouter();

  const pathSegments = router.pathname.split('/').filter((segment) => segment !== '');

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Inicio</Typography>

      {pathSegments.map((segment, index) => {

        if (segment === 'dashboard' && index === 0) return null;

        const isLast = index === pathSegments.length - 1;

        const formattedName = routeNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <Typography
            key={segment}
            variant="body1"
            sx={{
              color: isLast ? 'text.primary' : 'inherit',
              fontWeight: isLast ? 600 : 400,
            }}
          >
            {formattedName}
          </Typography>
        );
      })}
    </StyledBreadcrumbs>
  );
}