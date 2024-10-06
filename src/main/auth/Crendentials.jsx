import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Title from '../welcome/Title';
import { enqueueSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import instance from './instance';

export default () => {
    const { t } = useTranslation("main");

    const { register, handleSubmit, reset, getValues, setValue, isValid, formState: { isSubmitting } } = useForm({
        defaultValues: {
            username: "",
            password: ""
        }
    });

    const canSubmit = !isSubmitting && !isValid;

    const onLogin = handleSubmit(async (data) => {
        await instance.post("/login", data);
    });

    const onRegister = handleSubmit(async (data) => {
        await instance.post("/register", data);
    });

    return (
        <Stack sx={{ width: "100%", height: "100vh", justifyContent: "center", alignItems: "center" }} bgcolor="grey.A200">
            <Paper component={"main"}>
                <Stack spacing={2} sx={{ p: 5 }}>
                    <Typography fontSize="2em" fontWeight={"bold"}>
                        <Title />
                    </Typography>

                    <TextField
                        slotProps={{
                            input: {
                                readOnly: false,
                            },
                        }}
                        placeholder={t("username")}
                        fullWidth
                        autoComplete='username'
                        multiline
                        variant="standard"
                        autoFocus={true}
                        {...register("username")}
                    />

                    <TextField
                        slotProps={{
                            input: {
                                readOnly: false,
                            },
                        }}
                        placeholder={t("password")}
                        fullWidth
                        autoComplete='password'
                        multiline
                        variant="standard"
                        {...register("password")}
                    />

                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                        <Button disabled={!canSubmit} onClick={onRegister}>{t("register")}</Button>
                        <Button variant="contained" disabled={!canSubmit} onClick={onLogin}>{t("login")}</Button>
                    </Stack>
                </Stack>
            </Paper>
        </Stack >
    )
}

const wait = async () => new Promise(res => setTimeout(res, 1000))