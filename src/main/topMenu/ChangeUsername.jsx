import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { enqueueSnackbar } from 'notistack';
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../Connected";
import { ModalContext } from '../Modals';
import useSocketMutation from '../useSocketMutation';
import CleanInput from './CleanInput';
import { useTranslation } from 'react-i18next';

export default () => {
    const { Close } = useContext(ModalContext);
    const { handleSubmit, formState: { isValid, isSubmitting }, control } = useForm({ defaultValues: { username: "" } });
    const { setUser } = useContext(UserContext);
    const { t } = useTranslation(["change username", "form"]);

    const changeName = useSocketMutation("change username", {
        onSuccess: (newUser) => {
            enqueueSnackbar(t("messages.username changed"), { variant: 'success' });
            setUser(newUser);
            Close();
        }
    })

    const onSubmit = handleSubmit(async (data) => {
        const { username } = data;
        await changeName.mutateAsync(username)
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
                        autoComplete: 'username',
                        inputProps: { maxLength: 30 },
                        fullWidth: true,
                        variant: "standard",
                        label: t("label"),
                        autoFocus: true,
                        margin: "dense"
                    }}
                    controlProps={{
                        name: "username",
                        control: control,
                        rules: { required: true }
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={Close}>{t("cancel", { ns: "form" })}</Button>
                <Button variant="contained" type="submit" disabled={!isValid || isSubmitting}>{t("change", { ns: "form" })}</Button>
            </DialogActions>
        </form>
    );
}