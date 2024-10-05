import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Router from './Router';
import SideMenuFixed from './sideMenu/SideMenuFixed';
import Topmenu from './topMenu/Topmenu';

const Main = () => {
    const theme = useTheme();
    const noSideMenu = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Stack direction="row" sx={{ maxHeight: "100vh" }}>
            {!noSideMenu && <SideMenuFixed sx={{ zIndex: 3, flexShrink: 0 }} />}
            <Stack direction="column" sx={{ height: "100vh", flexGrow: 1 }}>
                <Topmenu sx={{ zIndex: 2 }} />
                <Stack direction="column" sx={{ position: "relative", flexGrow: 1 }}>
                    <Router />
                </Stack>
            </Stack>
        </Stack>
    );
}

export default Main;