import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ErrorIcon from '@mui/icons-material/Error';

export default () => {
    return (
        <Stack style={{ justifyContent: "center",alignItems:"center",height:"100%",opacity:0.5 }}>
            <ErrorIcon />
            <Typography>404 Not found</Typography>
        </Stack>
    );
}