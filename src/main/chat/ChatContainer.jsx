import Box from '@mui/material/Box';
import { useEffect } from "react";
import useSocketMutation from '../useSocketMutation';
import ListMessage from './ListMessage';
import Chat from "/src/main/chat/Chat";

export default ({ room }) => {
    const { joined, roomError } = useRoom(room);

    return (
            <Box style={{ flexGrow: 1, zIndex: 1 }} bgcolor="grey.A200">
                {
                    roomError ? (
                        <ListMessage>Error: {roomError.toString()}</ListMessage>
                    ) : !joined ? (
                        <ListMessage>Joining room</ListMessage>
                    ) : (
                        <Chat room={room}/>
                    )
                }
            </Box>
    );
}

function useRoom(room) {
    const joinRoom = useSocketMutation("join room");
    useEffect(() => {
        joinRoom.mutate(room)
    }, []);
    return { joined: joinRoom.isSuccess, roomError: joinRoom.error };
}