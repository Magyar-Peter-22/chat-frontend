import { useCallback } from 'react';

export default (updateRows) => {
    const Update = useCallback((id, newUser) => {
        updateRows(
            (message) => {
                //if the user id of this messaeg matches the chaged id, replace the user and return the message as new object
                if (message.userId === id) {
                    message.user = newUser;
                    return { ...message };
                }
                return message;
            }
        );
    },[updateRows]);

    return Update;
}