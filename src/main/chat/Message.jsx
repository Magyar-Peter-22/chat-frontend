import { memo, useContext } from 'react';
import { UserContext } from '../Connected';
import MessageBase from './MessageBase';

export default memo(({ message }) => {
    const { user } = useContext(UserContext);
    const isMe = message.user._id === user._id;
    return (
        <MessageBase
            isMe={isMe}
            message={message}
        />
    );
});