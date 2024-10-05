import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuBorder from '../MenuBorder';
import MenuLayout from '../MenuLayout';
import SideMenuMobile from "../sideMenu/SideMenuMobile";
import OnlineCounter from "./OnlineCounter";
import Settings from './Settings';

export default (props) => {
    const theme = useTheme();
    const noSideMenu = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <MenuBorder {...props}>
            <Paper component={"header"}>
                <MenuLayout sx={{ px: 2 }}>
                    <Stack direction="row" sx={{ height: "100%", alignItems: "center", justifyContent: "space-between" }}>
                        <Stack direction="row" spacing={1}>
                            {noSideMenu && <SideMenuMobile />}
                            <OnlineCounter />
                        </Stack>
                        <Settings />
                    </Stack>
                </MenuLayout>
            </Paper>
        </MenuBorder>
    );
}


