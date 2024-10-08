import {
    useMutation
} from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useContext } from 'react';
import { SocketContext } from './Connected';

export default (event, mutationProps) => {
    const socket = useContext(SocketContext);

    const fetch = useCallback(async (params = null) => {
        return new Promise((res, rej) => {
            socket.emit(event, params, (err, data) => {
                if (err)
                    return rej(err);
                res(data);
            });
        });
    }, []);

    const showError = useCallback((err) => { enqueueSnackbar(err.toString(), { variant: 'error' }); }, []);

    const mutation = useMutation({
        enabled: false,
        mutationFn: fetch,
        onError: showError,
        ...mutationProps
    });

    return mutation;
}