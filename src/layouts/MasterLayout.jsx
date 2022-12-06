import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Container, IconButton, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './components/Sidebar';

export default function MasterLayout() {
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setShowSidebar(!showSidebar);
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                    <Typography color="inherit">Hi, Lộc</Typography>
                </Toolbar>
            </AppBar>
            <Sidebar show={showSidebar} onKeyDown={toggleSidebar} onClick={toggleSidebar} />
            <Container maxWidth={false} sx={{ py: 3 }}>
                <Outlet />
            </Container>
        </>
    );
}
