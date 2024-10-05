import { Typography } from '@mui/material';

export default ({ children })=> {
    return <Typography sx={{ opacity: 0.5, textAlign: "center", py: 4 }}>{children}</Typography>
}