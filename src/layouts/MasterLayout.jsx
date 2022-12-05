import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from './components/Sidebar';

function MasterLayout() {
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
                <Toolbar>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" onClick={toggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Sidebar show={showSidebar} onKeyDown={toggleSidebar} onClick={toggleSidebar} />
            <Outlet />
        </>
    );
}

export default MasterLayout;
