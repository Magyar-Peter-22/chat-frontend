import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import ContentBlocks from '../welcome/ContentBlocks';
import SmartPhones from '../welcome/SmartPhones';
import Title from '../welcome/Title';

export default () => {
    const { t } = useTranslation("welcome");

    return (
        <Stack style={{ height: "100%", backgroundImage: "linear-gradient(0deg, rgb(212 226 239), transparent)", overflowX: "hidden" }} component="main" >
            <Stack direction="row" sx={{ mx: 5, flexGrow: 1 }}>

                <Stack sx={{ justifyContent: "center" }}>
                    <Typography fontSize="3em" fontWeight={"bold"}>
                        <Title/>
                    </Typography>
                    <Typography fontSize="2em" style={{ opacity: 0.75 }}>
                        {t("desc")}
                    </Typography>
                </Stack>

                <Stack direction="row" sx={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}>
                    <SmartPhones />
                </Stack>

            </Stack>

            <Paper sx={{ m: 5, mt: 0, zIndex: 1 }}>
                <ContentBlocks />
            </Paper>

        </Stack>
    );
}