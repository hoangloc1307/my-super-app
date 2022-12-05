import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MasterLayout from './layouts/MasterLayout';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';

function App() {
    return (
        <BrowserRouter>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<MasterLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="gallery" element={<Gallery />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
