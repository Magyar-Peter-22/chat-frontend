import axios from "axios";
import { enqueueSnackbar } from 'notistack';
const env = import.meta.env;

const url = env.VITE_SERVER_URL;

const instance = axios.create({
    baseURL: url,
});

//add tokens to headers
instance.interceptors.request.use(
    function (config) {
        const accessToken = sessionStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    enqueueSnackbar(formatError(error), { variant: "error" });
    return Promise.reject(error);
});

function formatError(error) {
    return error.response?.data || error.toString();
}

export default instance;