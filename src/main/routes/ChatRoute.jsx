import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { AnimatePresence } from "framer-motion";
import { useParams } from 'react-router-dom';
import ChatContainer from '../chat/ChatContainer';
import Creator from "../chat/Creator";
import DropFiles from '../chat/DropFiles';
import Transition from '../Transition';

export default () => {
    const { room } = useParams();
    return (
        <Stack style={{ height: "100%" }}>
            <Box style={{ flexGrow: 1, position: "relative", marginTop: -10, marginBottom: -10 }} component="main">
                <AnimatePresence>
                    <Transition key={room}>
                        <ChatContainer room={room} />
                    </Transition>
                </AnimatePresence>
            </Box>
            <Creator />
            <DropFiles/>
        </Stack>
    )
}