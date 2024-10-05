import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";

export default ({ text }) => {
    return (
        <Stack direction="column" spacing={1} sx={{
            width: "100%",
            height: "100vh",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFF",
        }}>
            <CircularProgress color="primary" />
            <Typography>{text}</Typography>
        </Stack>
    )
};
