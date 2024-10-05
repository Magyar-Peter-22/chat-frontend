import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {
        MuiPaper: {
            defaultProps: {
                elevation: 2,
            },
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif'
        ].join(','),
        button: {
            fontWeight: "bold",
        },
    },
});

export default theme;