import { motion } from "framer-motion";
import Box from '@mui/material/Box';
import { Suspense } from 'react';
import constants from "./constants";

export default ({ children }) => {
    return (
        <Suspense>
            <motion.div
                initial={{ opacity: 0, zIndex: 0 }}
                animate={{ opacity: 1, zIndex: 0 }}
                exit={{ opacity: 0, zIndex: 1 }}
                transition={{ duration: constants.animation }}
                style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    top: 0,
                    left: 0,
                }}
            >
                <Box style={{
                    width: "100%",
                    height: "100%"
                }}
                    bgcolor="grey.A200">
                    {children}
                </Box>
            </motion.div>
        </Suspense>
    )
}