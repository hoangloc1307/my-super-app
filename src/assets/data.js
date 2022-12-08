import { Collections, Coronavirus, Dashboard, NoteAlt } from '@mui/icons-material';

export const Menu = [
    {
        to: '/',
        icon: <Dashboard />,
        title: 'Dashboard'
    },
    {
        to: '/todo',
        icon: <NoteAlt />,
        title: 'To Do'
    },
    {
        to: '/covid',
        icon: <Coronavirus />,
        title: 'Covid-19'
    },
    {
        to: '/gallery',
        icon: <Collections />,
        title: 'Gallery'
    }
];
