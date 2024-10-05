import { ThemeProvider } from '@mui/material/styles';
import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";
import Connected from "./Connected";
import theme from "./theme";
import { SnackbarProvider } from 'notistack';
import '../i18n.js'; //initialize translation settings
import Box from '@mui/material/Box';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});

export default () => {
    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor="grey.A100">
                < QueryClientProvider client={queryClient} >
                    <SnackbarProvider
                        maxSnack={3}
                        anchorOrigin={{ horizontal: "center", vertical: "top" }}
                        autoHideDuration={5000}
                    >
                        <Connected />
                    </SnackbarProvider>
                </QueryClientProvider >
            </Box>
        </ThemeProvider>
    )
}