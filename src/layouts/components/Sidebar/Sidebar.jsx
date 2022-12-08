import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';
import { Menu } from '~/assets/data';

export default function Sidebar({ show, onKeyDown, onClick }) {
    return (
        <Drawer anchor={'left'} open={show} onKeyDown={onKeyDown} onClick={onClick}>
            <Box sx={{ width: 250 }}>
                <List>
                    {Menu.map((item) => (
                        <ListItem key={item.title} disablePadding button component={Link} to={item.to}>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}
