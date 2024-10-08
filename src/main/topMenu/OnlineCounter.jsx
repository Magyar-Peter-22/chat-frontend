import PublicIcon from '@mui/icons-material/Public';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import { useState,useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { SocketContext } from '../Connected';

export default () => {
    const [count, setCount] = useState(0);
    const { t } = useTranslation("main");
    const socket=useContext(SocketContext);

    useEffect(() => {
        function onChange(newCount) {
            setCount(newCount);
        }
        //get the count when mounted
        socket.emit('user count', onChange);
        //listen to the count after mounted       
        socket.on('user count', onChange);
        return () => {
            socket.off('user count', onChange);
        };
    }, []);

    return (
        <Stack direction="row" spacing={0.5} style={{ alignItems: "center" }}>
            <PublicIcon />
            <Typography>
                {t("online")}:
            </Typography>
            <Typography sx={{ fontWeight: "bold" }}>
                {count}
            </Typography>
        </Stack>
    );
}