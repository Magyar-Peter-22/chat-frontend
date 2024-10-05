import StringAvatar from "./StringAvatar";

function User({ username }) {
    return (
        <StringAvatar
            text={username}
        />
    );
}

export default User;