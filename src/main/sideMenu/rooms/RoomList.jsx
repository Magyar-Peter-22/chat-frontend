import Paper from '@mui/material/Paper';
import MenuBorder from '../../MenuBorder';
import ChatRoom from './ChatRoom';
import HomeRoom from './HomeRoom';
import { useRooms } from './RoomContext';
import Stack from '@mui/material/Stack';

function DynamicRows() {
    const { rooms } = useRooms();
    return (
        rooms.map((room, i) =>
            <ChatRoom name={room.name} key={room._id} id={room._id} />
        )
    )
}

export default () => {
    return (
        <MenuBorder style={{ flexGrow: 1, flexShrink: 1, overflowY: "hidden" }}>
            <Paper sx={{ overflowY: "auto", maxHeight: "100%", boxSizing: "border-box", p: 0.5 }} aria-label="room list">
                <Stack spacing={0.5} >
                    <HomeRoom />
                    <DynamicRows />
                </Stack>
            </Paper>
        </MenuBorder>
    );
};