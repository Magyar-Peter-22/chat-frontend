import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../Modals';
import CleanInput from '../topMenu/CleanInput';
import useSocketMutation from '../useSocketMutation';
import { roomLink } from './rooms/RoomContext';
import { useRooms } from './rooms/RoomContext';
import { useTranslation } from 'react-i18next';

export default () => {
    const { Close } = useContext(ModalContext);
    const { handleSubmit, formState: { isValid, isSubmitting }, control } = useForm({ defaultValues: { roomname: "" } });
    const navigate = useNavigate();
    const { setHasRoom } = useRooms();
    const { t } = useTranslation(["create room", "form"]);

    const createRoom = useSocketMutation("create room", {
        onSuccess: (data) => {
            enqueueSnackbar(t("messages.room created"), { variant: 'success' });
            setHasRoom(true);
            navigate(roomLink(data));
            Close();
        }
    })

    const onSubmit = handleSubmit(async (data) => {
        const { roomname } = data;
        await createRoom.mutateAsync(roomname)
    });

    return (
        <form onSubmit={onSubmit}>
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("description")}
                </DialogContentText>

                <CleanInput
                    fieldProps={{
                        autoComplete: 'roomname',
                        inputProps: { maxLength: 30 },
                        fullWidth: true,
                        variant: "standard",
                        label: t("label"),
                        autoFocus: true,
                        margin: "dense"
                    }}
                    controlProps={{
                        name: "roomname",
                        control: control,
                        rules: { required: true }
                    }}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={Close}>{t("cancel", { ns: "form" })}</Button>
                <Button variant="contained" type="submit" disabled={!isValid || isSubmitting}>{t("create", { ns: "form" })}</Button>
            </DialogActions>
        </form>
    );
}