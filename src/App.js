import { CssVarsProvider } from '@mui/joy/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MasterLayout from './layouts/MasterLayout';
import CompressImage from './pages/CompressImage';
import Covid19 from './pages/Covid19';
import Dashboard from './pages/Dashboard';
import Gallery from './pages/Gallery';
import ToDo from './pages/ToDo';

function App() {
    return (
        <BrowserRouter>
            <CssVarsProvider />
            <CssBaseline />
            <Routes>
                <Route path="/" element={<MasterLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="gallery" element={<Gallery />} />
                    <Route path="todo" element={<ToDo />} />
                    <Route path="covid" element={<Covid19 />} />
                    <Route path="image-compressor" element={<CompressImage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
