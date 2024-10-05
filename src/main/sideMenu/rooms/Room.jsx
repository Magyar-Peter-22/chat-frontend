import Badge from '@mui/material/Badge';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { NavLink } from "react-router-dom";
import Box from '@mui/material/Box';

export default ({ icon, text, link, selected, alerts = 0, ...props }) => {
    return (
        <NavLink
            to={link}
            style={{
                color: "unset",
                textDecoration: "unset",
            }}
        >
            {
                ({ isActive }) =>
                    <ListItemButton
                        sx={{
                            borderRadius: 2,
                        }}
                        aria-label="chat room"
                        selected={isActive}
                        {...props}>
                        <Badge
                            color="primary"
                            badgeContent={alerts}
                            sx={{ mr: 2 }}
                        >
                            {icon}
                        </Badge>
                        <ListItemText
                            primary={text}
                            primaryTypographyProps={{ style: { whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" } }}
                        />
                    </ListItemButton>
            }
        </NavLink>
    )
}