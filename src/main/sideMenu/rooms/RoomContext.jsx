import { enqueueSnackbar } from "notistack";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { matchPath } from 'react-router';
import { useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../../Connected";
import { useTranslation } from 'react-i18next';

function RoomProvider({ initialRooms, children }) {
    const [rooms, setRooms] = useState(initialRooms.rooms);
    const [hasRoom, setHasRoom] = useState(initialRooms.hasRoom);
    const [alerts, setAlerts] = useState({});
    const navigate = useNavigate();
    const { pathname } = useLocation()
    const { t } = useTranslation(["main"]);
    const socket = useContext(SocketContext);

    //clear the alerts of a room when entering
    const clearAlerts = useCallback((room) => () => {
        setAlerts(prev => {
            prev[room] = 0;
            return prev;
        });
    }, [])

    //if the selected room is deleted, return to the default
    const tryRelocate = useCallback((deletedId) => {
        const match = matchPath("/rooms/:room", pathname);
        if (match?.params?.room === deletedId) {
            enqueueSnackbar(t("messages.this room deleted"), { variant: "error" });
            navigate("/");
        }
    }, [pathname]);

    useEffect(() => {

        //add the new rooms to the list
        function onCreate(newRoom) {
            setRooms(prev => [...prev, newRoom]);
        }

        //remove deleted rooms from the list
        function onDelete(oldId) {
            setRooms(prev => prev.filter(room => room._id !== oldId));
            tryRelocate(oldId);
        }

        function onAlert(room) {
            setAlerts(prev => {
                let count = prev[room] ?? 0;
                count++;
                prev[room] = count;
                return { ...prev };
            });
        }

        socket.on('room created', onCreate);
        socket.on('room deleted', onDelete);
        socket.on('alert', onAlert);

        return () => {
            socket.off('room created', onCreate);
            socket.off('room deleted', onDelete);
            socket.off('alert', onAlert);
        };
    })

    return (
        <RoomContext.Provider value={{ rooms, alerts, hasRoom, setHasRoom, clearAlerts }}>
            {children}
        </RoomContext.Provider>
    )
}

const RoomContext = createContext({ rooms: [], alerts: {} });

function useRooms() {
    return useContext(RoomContext);
}

function roomLink(id) {
    return `/rooms/${id}`;
}

export { roomLink, RoomProvider, useRooms };
