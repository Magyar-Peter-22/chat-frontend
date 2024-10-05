import { useParams } from "react-router-dom";
import StringAvatar from '../../StringAvatar';
import Room from "./Room";
import { roomLink } from "./RoomContext";
import { memo } from "react";
import { useRooms } from "./RoomContext";

export default memo(({ name, id }) => {
    const { room } = useParams();
    const {alerts,clearAlerts}=useRooms();
    const myAlerts=alerts[id]??0;
    return (
        <Room
            icon={<StringAvatar text={name} />}
            text={name}
            link={roomLink(id)}
            selected={room === id}
            alerts={myAlerts}
            onClick={clearAlerts(id)}
        />
    )
}, (prev, next) => prev.id === next.id)
