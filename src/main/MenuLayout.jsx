import Box from '@mui/material/Box';

export default ({ children, style, ...props }) => {
    return <Box style={{ height: 65, ...style }} {...props}>{children}</Box>
}