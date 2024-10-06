import axios from "axios";
const env = import.meta.env;

const url = env.VITE_SERVER_URL;

export default axios.create({
    baseURL: url,
});