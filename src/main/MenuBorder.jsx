import Box from '@mui/material/Box';

export default ({ sx,children,...props }) => {
    return (<Box sx={{ p: 1, boxSizing: "border-box", ...sx }} {...props}>{children}</Box>)
}