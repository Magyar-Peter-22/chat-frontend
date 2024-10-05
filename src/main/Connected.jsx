import { AnimatePresence, motion } from "framer-motion";
import { enqueueSnackbar } from 'notistack';
import { createContext, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { BrowserRouter } from "react-router-dom";
import Loading from "../Loading";
import Main from "./Main";
import { ModalProvider } from './Modals';
import { RoomProvider } from "./sideMenu/rooms/RoomContext";
import socket from "/src/connect";
import constants from "./constants";

//it needs a default value to prevent errors in developer mode
const UserContext = createContext({ user: { _id: 0, username: "name" } });

export default () => {
    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState();
    const [error, setError] = useState("");
    const [rooms, setRooms] = useState();

    //connect to websocket and get the user
    useEffect(() => {
        try {
            socket.connect();

            function onConnect() {
                setIsConnected(true);
            }

            function onDisconnect() {
                setIsConnected(false);
            }

            function onError(data) {
                console.error(data);
                enqueueSnackbar(data.toString(), { variant: "error" });
            }

            function onUser(data) {
                setUser(data);
            }

            function onRooms(data) {
                setRooms(data);
            }

            socket.on('connect', onConnect);
            socket.on('disconnect', onDisconnect);
            socket.on('connect_error', onError);
            socket.once('auth', onUser);
            socket.once('load rooms', onRooms);

            return () => {
                socket.off('connect', onConnect);
                socket.off('disconnect', onDisconnect);
                socket.off('connect_error', onError)
            };
        }
        catch (err) {
            console.error(err);
            setError(err.message);
        }
    }, []);

    //show error page when failed to connect
    if (error)
        return error;

    //if all good, show the page
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <AnimatePresence>
                {!user || !isConnected || !rooms ?
                    <FadeoutLoading key="loading" />
                    :
                    <BrowserRouter key="loaded">
                        <RoomProvider initialRooms={rooms}>
                            <ModalProvider>
                                <Main />
                            </ModalProvider>
                        </RoomProvider>
                    </BrowserRouter>
                }
            </AnimatePresence>
        </UserContext.Provider>
    );
}
export { UserContext };

function FadeoutLoading() {
    const { t } = useTranslation("main");
    return (
        <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: constants.animation }}
            style={{
                position: "fixed",
                zIndex: 10,
                width: "100%"
            }}
        >
            <Loading text={t("connecting")} />
        </motion.div>
    );
}
