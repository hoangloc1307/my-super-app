import { Dashboard, Collections } from '@mui/icons-material';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

function Sidebar({ show, onKeyDown, onClick }) {
    return (
        <Drawer anchor={'left'} open={show} onKeyDown={onKeyDown} onClick={onClick}>
            <Box sx={{ width: 250 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Dashboard />
                            </ListItemIcon>
                            <ListItemText primary={'Dashboard'} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
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

export default Sidebar;
