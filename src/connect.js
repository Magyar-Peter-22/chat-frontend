import { io } from 'socket.io-client';

export default io("/",{
    withCredentials: true,
    autoConnect: false,
    path:"/api/socket.io/"
});