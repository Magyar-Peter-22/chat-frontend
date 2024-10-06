import { motion } from "framer-motion";
import constants from "./constants";

export default ({ children }) => {
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