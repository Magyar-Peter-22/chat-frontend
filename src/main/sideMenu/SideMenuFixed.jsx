import MenuContents from "./MenuContents";
import Box from '@mui/material/Box';

export default ({sx,...props}) => {
    return (
        <Box sx={{borderRight:1,borderColor:"divider",...sx}} {...props}>
            <MenuContents />
        </Box>
    );
}