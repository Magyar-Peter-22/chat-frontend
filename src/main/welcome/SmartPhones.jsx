import { useMediaQuery, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import "../../styles/smartphone.css";
import MessageBase from '../chat/MessageBase.jsx';
import exampleMessages from "./exampleMessages.js";
import { useTranslation } from 'react-i18next';

function ChatExample({ inverted }) {
    const { t } = useTranslation(["welcome"]);
    return (
        <Stack>
            {exampleMessages.map(({ isMe, ...message }, i) => {
                //convert the message to the format that is accepted by the component
                const formattedMessage={
                    text:t(message.text,message.params),
                    user:{
                        username:message.username
                    }
                }
                return <MessageBase
                    key={i}
                    isMe={inverted ? !isMe : isMe}
                    message={formattedMessage}
                />
            }
            )}
        </Stack>
    )
}

function SmartphoneContainer({ children, ...props }) {
    return (
        <Box boxShadow={5} className="smartphone" {...props}>
            <div className='content'>
                {children}
            </div>
        </Box>
    )
}

function SmartPhoneInstance({ inverted, ...props }) {
    return (
        <SmartphoneContainer {...props}>
            <Stack sx={{ justifyContent: "center" }}>
                <ChatExample inverted={inverted} />
            </Stack>
        </SmartphoneContainer>
    )
}

function SmartPhones() {
    const theme = useTheme();
    const onePhone = useMediaQuery(theme.breakpoints.down(1520));
    const smallPhone = useMediaQuery(theme.breakpoints.down(1290));
    const noPhoneWithMenu = useMediaQuery(theme.breakpoints.down(1050));
    const noMenu = useMediaQuery(theme.breakpoints.down("md"));
    const noPhoneWithoutMenu = useMediaQuery(theme.breakpoints.down(770));
    const noPhone = noMenu ? noPhoneWithoutMenu : noPhoneWithMenu;

    if (noPhone)
        return;

    return (
        <Stack direction="row" style={{ position: "absolute", maxWidth: smallPhone && 300 }}>
            {
                onePhone ? (
                    <SmartPhoneInstance style={{ transform: `TranslateX(${smallPhone ? -40 : 0}px) Scale(${smallPhone ? 0.6 : 0.8}) rotate(${smallPhone ? 10 : 25}deg)` }} />
                ) : (
                    <>
                        <SmartPhoneInstance style={{ transform: "Scale(0.7) rotate(25deg) TranslateY(-200px)" }} />
                        <SmartPhoneInstance style={{ transform: "Scale(0.7) rotate(25deg) TranslateY(200px)" }} inverted />
                    </>
                )
            }
        </Stack>
    )
}

export default SmartPhones;
