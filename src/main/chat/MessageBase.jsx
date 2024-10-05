import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from "@mui/material/Typography";
import AutoDisplayer, { RawDisplayer } from './CloudMediaDisplayer';
import User from "/src/main/User";

export default ({ message, isMe }) => {
    return (
        <Stack direction={isMe ? "row-reverse" : "row"} spacing={1} sx={{ py: 1}}>
            <User username={message.user.username} aria-label="user profile" />
            <Stack direction={"column"} spacing={0.5} sx={{ alignItems: isMe ? "end" : "start",overflowX:"hidden" }}>
                <Typography sx={{ fontWeight: 500 }} aria-label="username" >{message.user.username}</Typography>
                <Paper sx={{
                    p: 1,
                    borderRadius: 2,
                    borderStartStartRadius: !isMe && 0,
                    borderStartEndRadius: isMe && 0,
                    bgcolor: isMe && "primary.main",
                    color: isMe && "primary.contrastText"
                }}
                    elevation={2}>
                    <Typography aria-label="message text" >
                        {message.text}
                    </Typography>
                </Paper>
                <MessageMedia message={message} />
            </Stack >
        </Stack>
    )
}

function MessageMedia({ message: { media } }) {
    if (!media)
        return;

    const raw = [];
    const images = [];

    media.forEach(el => {
        if (el.type === "raw")
            raw.push(el);
        else
            images.push(el);
    })

    return (
        <Stack spacing={1} sx={{ maxWidth:'100%' }}>
            {
                images.length > 0 &&
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {images.map((el, i) => {
                        return (
                            <Box
                                sx={{
                                    height: 200,
                                    width: 200,
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    background: "black"
                                }}
                                key={i}
                            >
                                <AutoDisplayer fileData={el} />
                            </Box>
                        )
                    })}
                </div>
            }
            {raw.map((el, i) => <RawDisplayer fileData={el} key={i} />)}
        </Stack>
    )
}