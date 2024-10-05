import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { lazy, memo, useContext } from "react";
import { useTranslation } from 'react-i18next';
import MenuBorder from '../MenuBorder';
import MenuLayout from '../MenuLayout';
import { ModalContext } from '../Modals';
import { useRooms } from './rooms/RoomContext';
import RoomList from './rooms/RoomList';
import Title from '../welcome/Title';
const CreateRoom = lazy(() => import("./CreateRoom"));
const DeleteRoom = lazy(() => import("./DeleteRoom"));

const MenuContents = memo(() => {
    const { Show } = useContext(ModalContext);
    const { hasRoom } = useRooms();
    const { t } = useTranslation("main");
    return (
        <Stack sx={{ width: 250, maxWidth: "100vw", height: "100%" }} component="nav">
            <MenuBorder>
                <Paper >
                    <MenuLayout style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                        <Typography sx={{ ml: 1, fontWeight: "bold",fontSize:"1.5em" }}>
                            <Title />
                        </Typography>
                    </MenuLayout>
                </Paper>
            </MenuBorder>

            <RoomList />

            <MenuBorder>
                <Paper >
                    <MenuLayout sx={{ display: "flex", flexDirection: "column", justifyContent: "center", px: 2 }}>
                        {hasRoom ?
                            <Tooltip title="Delete the chat room that you created.">
                                <Button variant="text" onClick={() => { Show(<DeleteRoom />) }}>{t("delete room")}</Button>
                            </Tooltip>
                            :
                            <Tooltip title="Create your own chat room.">
                                <Button variant="text" onClick={() => { Show(<CreateRoom />) }}>{t("create room")}</Button>
                            </Tooltip>
                        }
                    </MenuLayout>
                </Paper>
            </MenuBorder>
        </Stack >
    );
});

export default MenuContents;