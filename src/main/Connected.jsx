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
import Crendentials from "./auth/Crendentials";
import Transition from "./Transition";
import instance from "./auth/instance";
import { getAccessToken, getRefreshToken, saveAccessToken } from "./auth/tokens";
import { useQuery } from "@tanstack/react-query";
import { io } from 'socket.io-client';

const env = import.meta.env;
const url = env.VITE_SERVER_URL;

//it needs a default value to prevent errors in developer mode
const UserContext = createContext({ user: { _id: 0, username: "name" } });

const SocketContext = createContext();

export default () => {
    const [isConnected, setIsConnected] = useState(false);
    const [user, setUser] = useState();
    const [error, setError] = useState("");
    const [rooms, setRooms] = useState();
    const [needsLogin, setNeedsLogin] = useState(false);
    const [socket, setSocket] = useState();

    //try to use the refresh token on start
    const { data: authData, isPending } = useQuery({
        queryKey: ["refreshToken"],
        staleTime: 0,
        queryFn: async () => {
            //find token
            const refreshToken = getRefreshToken();

            //exit if no token
            if (!refreshToken)
                return null;

            //try to get access token from refresh token
            const res = await instance.post("/auth/refresh_token", { refreshToken });
            const accessToken = res.data ?? null;
            saveAccessToken(accessToken);
            console.log(`obtained access token from refresh token:\n${accessToken}`)
            return accessToken;
        }
    });

    //connect to websocket and get the user
    //after the login attempt is done
    useEffect(() => {
        if (!authData)
            return;

        try {
            //create new socket
            const socket = io(url, {
                extraHeaders: {
                    Authorization: `Bearer ${getAccessToken()}`
                }
            });

            //send tokens on connect
            socket.connect();

            function onConnect() {
                setIsConnected(true);
                setSocket(socket);
            }

            function onDisconnect() {
                debugger
                setIsConnected(false);
            }

            function onError(data) {
                if (data.message === "401")
                    return setNeedsLogin(true);

                console.error(data);
                enqueueSnackbar(data.toString(), { variant: "error" });
            }

            function onUser(data) {
                debugger
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
    }, [authData]);

    //show error page when failed to connect
    if (error)
        return error;

    //if all good, show the page
    return (
        <UserContext.Provider value={{ user, setUser }}>
            <SocketContext.Provider value={socket}>
                <AnimatePresence>
                    {
                        isPending ? (
                            //when the auth fetch is still pending, show a loading screen
                            <FadeoutLoading key="loading" text={"authentication"} />
                        ) : needsLogin || !authData ? (
                            //when failed to login in either the fetch or the connection, show the login form
                            <Transition key="crendentials" >
                                <Crendentials />
                            </Transition>
                        ) : (user === null || !isConnected || !rooms) && authData ? (
                            //when logged in and connecting, show the a loading screen
                            <FadeoutLoading key="loading" text={"connecting"} />
                        ) : (
                            //when everything is done, show the main page
                            <BrowserRouter key="loaded">
                                <RoomProvider initialRooms={rooms}>
                                    <ModalProvider>
                                        <Main />
                                    </ModalProvider>
                                </RoomProvider>
                            </BrowserRouter >
                        )
                    }
                </AnimatePresence >
            </SocketContext.Provider>
        </UserContext.Provider >
    );
}
export { UserContext };

function FadeoutLoading({ text }) {
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
            <Loading text={t(text)} />
        </motion.div>
    );
}
