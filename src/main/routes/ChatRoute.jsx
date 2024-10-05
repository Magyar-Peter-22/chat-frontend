import Box from '@mui/material/Box';
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from 'react-router-dom';
import ChatContainer from '../chat/ChatContainer';
import Stack from '@mui/material/Stack';
import Creator from "../chat/Creator";
import constants from '../constants';
import DropFiles from '../chat/DropFiles';

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

function Transition({ children }) {
    return (
        <motion.div
            animate={{ opacity: 1, zIndex: 0 }}
            exit={{ opacity: 0, zIndex: 1 }}
            transition={{ duration: constants.animation }}
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                display: "flex",
                flexDirection: "column"
            }}
        >
            {children}
        </motion.div>
    )
}