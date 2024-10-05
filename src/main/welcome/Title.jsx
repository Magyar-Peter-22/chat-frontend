import Typography from '@mui/material/Typography';

export default ()=>{
    return <><Span color="primary">My</Span> <Span>Chat</Span></>
}

const Span= ({ children, ...props }) => {
    return <Typography component="span" style={{ fontSize: "inherit", fontWeight: "inherit" }} {...props}>{children}</Typography>
}