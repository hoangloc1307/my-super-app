import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MasterLayout from './layouts/MasterLayout';
import Covid19 from './pages/Covid19';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import ToDo from './pages/ToDo';

function App() {
    return (
        <BrowserRouter>
            <CssBaseline />
            <Routes>
                <Route path="/" element={<MasterLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="todo" element={<ToDo />} />
                    <Route path="covid" element={<Covid19 />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
