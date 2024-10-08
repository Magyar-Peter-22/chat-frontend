import { io } from 'socket.io-client';
const env = import.meta.env;

const url = env.VITE_SERVER_URL;

export default io(url, {
    autoConnect: false,
});