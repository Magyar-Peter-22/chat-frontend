import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { useContext } from "react";
import { ModalContext } from '../Modals';
import useSocketMutation from '../useSocketMutation';
import { useRooms } from './rooms/RoomContext';
import { useTranslation } from 'react-i18next';

export default () => {
    const { Close } = useContext(ModalContext);
    const {setHasRoom} = useRooms();
    const { t } = useTranslation(["delete room","form"]);

    const deleteRoom = useSocketMutation("delete room", {
        onSuccess: () => {
            enqueueSnackbar(t("messages.room deleted"), { variant: 'success' });
            setHasRoom(false);
            Close();
        }
    })

    return (
        <>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                {t("description")}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={Close}>{t("cancel",{ns:"form"})}</Button>
                <Button variant="contained" disabled={deleteRoom.isPending} onClick={()=>{deleteRoom.mutate()}}>{t("delete",{ns:"form"})}</Button>
            </DialogActions>
        </>
    );
}