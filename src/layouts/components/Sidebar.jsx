import { Dashboard, Collections, NoteAlt } from '@mui/icons-material';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Sidebar({ show, onKeyDown, onClick }) {
    return (
        <Drawer anchor={'left'} open={show} onKeyDown={onKeyDown} onClick={onClick}>
            <Box sx={{ width: 250 }}>
                <List>
                    <ListItem disablePadding button component={Link} to={'/'}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding button component={Link} to={'/todo'}>
                        <ListItemButton>
                            <ListItemIcon>
                                <NoteAlt />
                            </ListItemIcon>
                            <ListItemText primary={'To Do'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding button component={Link} to={'/gallery'}>
                        <ListItemButton>
                            <ListItemIcon>
                                <Collections />
                            </ListItemIcon>
                            <ListItemText primary={'Gallery'} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}
