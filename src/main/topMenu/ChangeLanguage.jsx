import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n.js';
import { ModalContext } from '../Modals';
import ReactHookFormSelect from './ReactHookFormSelect';

export default () => {
    const { Close } = useContext(ModalContext);
    const { handleSubmit, formState: { isValid, isSubmitting }, control } = useForm({ defaultValues: { language: i18n.resolvedLanguage } });
    const { t } = useTranslation(["change language","form"]);

    const onSubmit = handleSubmit(async (data) => {
        const { language } = data;
        await i18n.changeLanguage(language);
    });

    return (
        <form onSubmit={onSubmit}>
            <DialogTitle>
                    {t("title")}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {t("description")}
                </DialogContentText>

                <ReactHookFormSelect
                    fieldProps={{
                        fullWidth: true,
                        variant: "standard",
                        label: "Language",
                        autoFocus: true,
                    }}
                    controlProps={{
                        name: "language",
                        control: control,
                        rules: { required: true }
                    }}
                >
                    <MenuItem value="en">EN</MenuItem>
                    <MenuItem value="hu">HU</MenuItem>
                    <MenuItem value="de">DE</MenuItem>
                </ReactHookFormSelect>

            </DialogContent>
            <DialogActions>
                <Button onClick={Close}>{t("cancel",{ns:"form"})}</Button>
                <Button variant="contained" type="submit" disabled={!isValid || isSubmitting}>{t("change",{ns:"form"})}</Button>
            </DialogActions>
        </form>
    );
}