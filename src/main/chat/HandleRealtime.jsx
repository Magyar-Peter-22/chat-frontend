import { useContext, useEffect } from 'react';
import { SocketContext } from '../Connected';
import { UserContext } from '../Connected';

function handleRealtime(addMessage, updateUser) {
    const { user } = useContext(UserContext);
    const socket=useContext(SocketContext);

    useEffect(() => {
        function onMessage(data) {
            //check if this message was sent by the user
            const isMe = data.user._id === user._id;
            addMessage(data, isMe);
        }

        function onUser(id, newUser) {
            updateUser(id, newUser);
        }

        socket.on('get message', onMessage);
        socket.on('update user', onUser);
        return () => {
            socket.off('get message', onMessage);
            socket.off('update user', onUser);
        };
    }, [socket]);
}

export default handleRealtime;