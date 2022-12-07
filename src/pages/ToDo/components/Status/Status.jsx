import { Chip } from '@mui/material';

export default function Status({ icon, label, color }) {
    return <Chip icon={icon} label={label} variant="outlined" color={color} size="small" />;
}
