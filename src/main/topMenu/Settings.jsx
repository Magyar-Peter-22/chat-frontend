import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { lazy, Suspense, useCallback, useContext, useState } from "react";
import { UserContext } from "../Connected";
import { ModalContext } from '../Modals';
import User from "/src/main/User";
import TranslateIcon from '@mui/icons-material/Translate';
import { useTranslation } from 'react-i18next';
import Divider from '@mui/material/Divider';
const ChangeUsername = lazy(() => import('./ChangeUsername'));
const ChangeLanguage = lazy(() => import('./ChangeLanguage'));

export default () => {
    const { user } = useContext(UserContext);
    const { Show } = useContext(ModalContext);
    const { t } = useTranslation("main");

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    return (
        <>
            <Tooltip title={t("settings")}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-label="open settings"
                    aria-controls={open ? 'settings' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                >
                    <User username={user.username} />
                </IconButton>
            </Tooltip>

            <Suspense>
                <Popover
                    anchorEl={anchorEl}
                    id="settings"
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <List
                        subheader={
                            <ListSubheader
                                component="div"
                                onClick={(e) => { e.preventDefault() }}
                            >
                                {t("welcome", { username: user.username })}
                            </ListSubheader>
                        }>

                        <Divider />

                        <div onClick={handleClose}>

                            <ListItemButton onClick={() => { Show(<ChangeUsername />) }}>
                                <ListItemIcon>
                                    <EditIcon />
                                </ListItemIcon>
                                <ListItemText primary={t("change username")} />
                            </ListItemButton>

                            <ListItemButton onClick={() => { Show(<ChangeLanguage />) }}>
                                <ListItemIcon>
                                    <TranslateIcon />
                                </ListItemIcon>
                                <ListItemText primary={t("language")} />
                            </ListItemButton>

                        </div>
                    </List>
                </Popover>
            </Suspense>
        </>
    );
}
